const users = [
  {
    name: "Иван",
    surname: "Иванович",
    patronymic: "Иванов",
    password: "ПарольИванова",
    email: "Иванов@test.ru",
    telephone: "88005553535",
    roleId: 1, 
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
    roleId: 2, 
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
    roleId: 3,
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
    roleId: 5, 
    photo: null,
    registrationDate: Date()
  },

];

module.exports = async (Models) => {
  for (const user of users) {
    await Models.User.create(user);
  }
};
