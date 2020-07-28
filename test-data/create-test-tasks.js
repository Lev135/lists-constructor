const util = require('util');

const POST = {
  statement: "Условие задачи",
  answer: "Ответ на задачу",
  solutions: [
    {
      body: "Текст первого решения",
      themes: [
        3,
        4,
        5 // id-шники тем
      ],
      grade: 5, // Номер класса, в котором предполагается разбирать данной решение
    },
    {
      body: "Текст второго решения",
      themes: [
        3,
        4
      ],
      grade: 7,
    }
  ],

  notes: [
    {
      type: "подсказка",
      label: "Подсказка к пункту а решения",
      body: "Какая-то там подсказка..."
    },
    {
      type: "подсказка",
      label: "Подсказка к пункту b решения",
      body: "А здесь какая-то другая подсказка"
    },
    {
      type: "методические рекомендации",
      body: "До решения данной задачи лучше разобрать задачу #12"
    },
    {
      type: "подвох",
      body: "В пункте в необходимо рассмотреть такой-то частный случай -- без него решение задачи не засчитывается"
    }
  ],
  access : {
    roles: [
        { roleId: 1, typeId: 1 },
        { roleId: 2, typeId: 2 }
    ],
    users: [
        { userId: 1, typeId: 5 },
        { userId: 2, typeId: 1 },
        { userId: 3, typeId: 1 },
        { userId: 4, typeId: 1 }
    ]
  },
  changeComment: "Тестовая задача"
};

module.exports = async (Models) => {
  const TaskService = require('../modules/services/task-service')(Models);

  console.log('ИСХОДНЫЙ ОБЪЕКТ (POST)', POST);
  const task = await TaskService.createTask(POST, 1);
  console.log('ЗАПИСЬ В БД', task.get({plain: true}));
  console.log('ЗАПИСЬ С INCLUDE', (await Models.materials.Task.findByPk(task.id, {
    include: [
      {
        model: Models.materials.Material,
        as: 'material'
      }
    ]
  })).get({plain: true}));
  const taskObj = await TaskService.getTaskObj(task.id);
  console.log('ПОЛУЧЕННЫЙ ОБЪЕКТ', 
    util.inspect(taskObj, {compact: false, depth: null, colors: true}));
};
