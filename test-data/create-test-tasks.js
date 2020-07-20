const task = {
  "statement": "Условие задачи",
  "answers": "Ответ на задачу",
  "solutions": [
    {
      "index": 0,
      "body": "Текст первого решения",
      "themes": [
        3,
        4,
        5 // id-шники тем
      ],
      "grade": 5, // Номер класса, в котором предполагается разбирать данной решение
    },
    {
      "index": 1,
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
};

module.exports = (Models) => {
  const TaskWrapper = require('../modules/models-wrappers/task-wrapper')
                                (Models);
  let taskData;
  TaskWrapper.addTaskFromObject(task)
    .then((_task) => {
      taskData = _task;
      return Models.materials.Task.findAll({raw: true});
    })
    .then((tasks) => {
      console.log("TASKS", JSON.stringify(tasks, null, 2));
      return TaskWrapper.taskToObject(taskData.id);
    })
    .then(obj => {
      console.log(JSON.stringify(obj, null, 2));
    })
    .catch(err => console.error("ERROR", err));
};
