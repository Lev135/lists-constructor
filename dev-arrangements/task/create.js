// Создание задачи (task/create).

// Зависимости: info/themes для получения иерархии тем
//              info/users для получения списка пользователей

// При GET-запросе генерируется пустая страница создания новой задачи

// При POST-запросе клиент отправляет json с информацией о внесённых данных:

const createPost = {
  "statement": "Условие задачи",
  "answer": "Ответ на задачу",
  "solutions": [
    {
      "body": "Текст первого решения",
      "themes": [
        3,
        4,
        5 // id-шники тем
      ],
      "grade": 5, // Номер класса, в котором предполагается разбирать данной решение
    },
    {
      "body": "Текст второго решения",
      "themes": [
        3,
        4
      ],
      "grade": 7,
    }
  ],

  "notes": [
    "Дополнительные замечания",
    "По поводу задачи и её решения",
    "Возможно, подсказки, которые следует дать ученику",
    "Или какие-то методические рекомендации"
  ],
  "to-publish": false, // Предложена ли к публикации
  "access" : {
    "simple-access": {
      "editors": true, // Открывает доступ всем редакторам
      "teachers": true, // открывает доступ всем учителям
      "all-users": false, // Всем пользователям, в т. ч. неподтверждённым
      "extra": [
        1,
        2
      ] // Массив пользователей, которым предоставлен индивидуальный доступ 1 уровня
    },
    "editor-access": {
      "editors": true,
      "teachers": false,
      "all-users": false,
      "extra": [
        2,
        3,
        4
      ] // Массив пользователей, которым предоставлен индивидуальный доступ 2 уровня
    },
    "moderator-access": {
      "userId": 3,
    } // Полными правами на задачу может обладать лишь один пользователь
  }
};
