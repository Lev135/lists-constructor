const hash = str => "hash_" + str;

const getUserInfoFromBody = body => ({
  name: body.name,
  surname: body.surname,
  patronymic: body.patronymic,
  password: hash(body.password),
  email: body.email,
  telephone: body.telephone,
  isTeacher: false,
  isEditor: false,
  isAdmin: false,
  photo: null,
  registrationDate: Date()
});

const getAllInfo = user => ({
  name: user.name,
  surname: user.surname,
  patronymic: user.patronymic,
  email: user.email,
  telephone: user.telephone,
  isTeacher: user.isTeacher,
  isEditor: user.isEditor,
  isAdmin: user.isAdmin,
  photo: user.photo,
  registrationDate: user.registrationDate
});

module.exports = (Models, passport) => {
  const User = Models.User;
  return {
    loginPage: (req, res) => {
      res.render("user/login.pug");
    },
    login: (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/');
        }
        return req.login(user, err =>
          (err ? next(err) : res.redirect(`./profile?id=${user.id}`)));
      })(req, res, next);
    },

    registrationPage: (req, res) => {
      res.render("user/register.pug");
    },
    register: (req, res, next) => {
      console.log(req.body);
      if (!req.body) {
        return res.sendStatus(400);
      }
      const info = getUserInfoFromBody(req.body);
      if (!info) {
        return res.sendStatus(400);
      }
      User.create(info).then(user => {
        console.log(user);
        req.login(user, err => {
          return err ? next(err) : res.redirect(`./profile?id=${user.id}`);
        });
      }).catch(err => {
        console.error(err);
        res.send(`<p>Ошибка при обработке запроса: ${err.message}</p>`);
      });
    },

    logout: (req, res) => {
      req.logout();
      res.redirect('/');
    },

    usersPage: (req, res) => {
      User.findAll({raw: true}).then(users => {
        console.log(users);
        res.render("user/users.pug", {users: users});
      }).catch(err => {
        console.error(err);
        res.send(`<p>Ошибка при обработке запроса: ${err.message}</p>`);
      });
    },

    profilePage: (req, res) => {
      User.findByPk(req.query.id).then(profileUser => {
        User.findByPk(req.user.id).then(user => {
          if (profileUser.id === user.id) {
            res.render('user/my-profile.pug', {mainInfo: getAllInfo(user)});
          }
          else {
            res.render('user/profile.pug', {mainInfo: getAllInfo(profileUser)});
          }
        }).catch(err => {
          res.send(`Ошибка при открытии страницы пользователя: ${err}`);
        });
      }).catch(err => {
        res.send(`Ошибка при открытии страницы пользователя: ${err}`);
      });
    },
  };
};
