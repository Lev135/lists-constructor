const users = [
  {
    name: "Иван",
    surname: "Иванович",
    patronymic: "Иванов",
    password: "ПарольИванова",
    email: "Иванов@test.ru",
    telephone: "88005553535",
    isTeacher: false,
    isEditor: false,
    isAdmin: false,
    photo: null,
    registrationDate: Date()
  },
  {
    name: "Пётр",
    surname: "Петрович",
    patronymic: "Петров",
    password: "ПарольПетрова",
    email: "Петров@test.ru",
    telephone: null,
    isTeacher: true,
    isEditor: false,
    isAdmin: false,
    photo: null,
    registrationDate: Date()
  },
  {
    name: "Николай",
    surname: "Иванович",
    patronymic: null,
    password: "ПарольНиколаева",
    email: "Николаев@test.ru",
    telephone: "88000000000",
    isTeacher: true,
    isEditor: true,
    isAdmin: false,
    photo: null,
    registrationDate: Date()
  },
  {
    name: "Админ",
    surname: "Админов",
    patronymic: null,
    password: "admin",
    email: "admin@a",
    telephone: null,
    isTeacher: false,
    isEditor: false,
    isAdmin: true,
    photo: null,
    registrationDate: Date()
  },

];

module.exports = (Models) => {
  for (const user of users) {
    Models.User.create(user);
  }
};
