const hash = str => str;

const getUserInfo = body => ({
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

module.exports = (Models) => {
  return {
    login: (req, res, next) => {
      pasport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/');
        }
        return req.login(user, err =>
          (err ? next(err) : res.redirect(`./profile?${user.id}`)));
      })(req, res, next);
    },
    logout: (req, res) => {
      req.logout();
      res.redirect('/');
    },
    register: (req, res, next) => {
      console.log(`Registration post: `);
      console.log(req.body);
      if (!req.body) {
        return res.sendStatus(400);
      }
      const info = getUserInfo(req.body);
      if (!info) {
        return res.sendStatus(400);
      }
      Models.User.create(info).then(user => {
        console.log(user);
        req.login(user, err => {
          return err ? next(err) : res.redirect(`./profile?${user.id}`);
        });
      }).catch(err => console.error(err));
    },
    registrationPage: (req, res) => {
      console.log("Rendering registration page...");
      res.render("user/register.pug");
    },
    loginPage: (req, res) => {
      res.render("user/login.pug");
    }
    /*
    registrationPost: (req, res) => {
      console.log(`Registration post: `);
      console.log(req.body);
      if (!req.body) {
        return res.sendStatus(400);
      }
      const info = getUserInfo(req.body);
      if (!info) {
        return res.sendStatus(400);
      }
      Models.User.create(info).then(user => {
        console.log(user);
        res.redirect(`./profile?${user.id}`);
      });
    },
    profilePage: (req, res) => {
      res.send("Профиль пользователя");
    },
    editPage: (req, res) => {
      res.send("Редактирование профиля");
    },
    editPost: (req, res) => {

    },
    usersPage: (req, res) => {
      res.send("Информация о пользователях");
    }
    */
  };
};
