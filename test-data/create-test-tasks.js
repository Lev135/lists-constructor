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

  console.log('ИСХОДНЫЙ ОБЪЕКТ (POST)', 
    util.inspect(POST, {compact: false, depth: null, colors: true}));
  const task = await TaskService.createTask(POST, 1);
  const taskObj = await TaskService.getTaskObj(task.id);
  console.log('ПОЛУЧЕННЫЙ ОБЪЕКТ', 
    util.inspect(taskObj, {compact: false, depth: null, colors: true}));

  console.log('ИСХОДНЫЙ ОБЪЕКТ изменения (POST)', 
    util.inspect(POST, {compact: false, depth: null, colors: true}));
  const taskChange = await TaskService.addChange(POST, task.id, 1);
  const taskChangeObj = await TaskService.getTaskObj(taskChange.id);
  console.log('ПОЛУЧЕННЫЙ ОБЪЕКТ', 
    util.inspect(taskChangeObj, {compact: false, depth: null, colors: true}));
    
  console.log('ИСХОДНЫЙ ОБЪЕКТ второй версии (реализует изменение первой) (POST)', 
    util.inspect(POST, {compact: false, depth: null, colors: true}));
  const taskVersion = await TaskService.addVersion(POST, task.id, 1, [ taskChange.id ]);
  const taskVersionObj = await TaskService.getTaskObj(taskVersion.id);
  console.log('ПОЛУЧЕННЫЙ ОБЪЕКТ', 
    util.inspect(taskVersionObj, {compact: false, depth: null, colors: true}));

  console.log('СНОВА ПОЛУЧЕННЫЙ ОБЪЕКТ изменения (POST)',
    util.inspect(await TaskService.getTaskObj(taskChange.id),
      {compact: false, depth: null, colors: true} ));
};
