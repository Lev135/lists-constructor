module.exports = (Models) => {
  const Task = Models.Task;
  function _taskToObject(id) {
    return new Promise((resolve, reject) => {
      const query = {
        raw: false,
        where: {id: id},
        attributes: [ 'statement', 'answer' ],
        include: [
          {
            model: Models.materials.taskFields.Solution,
            as: "solutions",
            order: [ ['index', 'ASC'] ],
            attributes: [ 'body', 'grade' ],
            include: [
              {
                model: Models.tags.Theme,
                as: "themes",
                attributes: [ 'id' ]
              }
            ]
          },
          {
            model: Models.materials.taskFields.Note,
            as: "notes",
            order: [ ['index', 'ASC'] ],
            attributes: [ 'body' ]
          },
          {
            model: Models.tags.Source,
            as: "source",
            attributes: [ 'name' ]
          }
        ]
      };
      Models.materials.Task.findOne(query)
        .then((obj) => {
          obj = obj.get({plain: true});
          console.log("OBJ", (obj));
          for (const i in obj.notes) {
            obj.notes[i] = obj.notes[i].body;
          }
          console.log("OBJ", (obj));
          for (const solution of obj.solutions) {
            for (const i in solution.themes) {
              solutions.themes[i] = solution.themes[i].id;
            }
          }
          console.log("OBJ", (obj));
          if (obj.source) {
            obj.source = obj.source.id;
          }
          console.log("OBJ", obj);
          resolve(obj);
        })
        .catch(err => reject(err));
    });
  }
  function _addTaskFromObject(obj) {
    return new Promise((resolve, reject) => {
      const query = {
        include: [
          {
            model: Models.materials.taskFields.Solution,
            as: "solutions",
            // include: [
            //   {
            //     model: Models.tags.Theme,
            //     as: "themes"
            //   }
            // ]
          },
          {
            model: Models.materials.taskFields.Note,
            as: "notes",
          },
          // {
          //   model: Models.tags.Source,
          //   as: "source"
          // }
        ]
      };
      for (const i in obj.notes) {
        obj.notes[i] = {
          body: obj.notes[i],
          index: i
        };
      }
      console.log('OBJ', obj);
      Models.materials.Task.create(obj, query)
        .then((task) => {
          console.log("TASK", JSON.stringify(task, null, 2));
          resolve(task);
        })
        .catch((err) => reject(err));
    });
  }
  return {
    taskToObject: _taskToObject,
    addTaskFromObject: _addTaskFromObject
  };
};
