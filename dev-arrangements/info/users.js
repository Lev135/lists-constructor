// При запросе списка пользователей /info/users сервер отправляет следующий JSON:

const createUsersPost = {
  "users": [
    {
      "name": "Иван",
      "surname": "Иванович",
      "patronymic": "Иванов",
      "email": "Иванов@test.ru",
      "telephone": "88005553535",
      "isTeacher": false,
      "isEditor": false,
      "isAdmin": false,
      "photo": null,
    },
    {
      "name": "Пётр",
      "surname": "Петрович",
      "patronymic": "Петров",
      "email": "Петров@test.ru",
      "telephone": null,
      "isTeacher": true,
      "isEditor": false,
      "isAdmin": false,
      "photo": null,
    }
  ]
};
