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
    registrationPage: (req, res) => {
      console.log("Rendering registration page...");
      res.render("user/registration.pug");
    },
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
  };
};
