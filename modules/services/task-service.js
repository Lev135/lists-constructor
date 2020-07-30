module.exports = (Models) => {
  const Task = Models.materials.Task;
  const Solution = Models.materials.taskFields.Solution;
  const Theme = Models.tags.Theme;
  const Note = Models.materials.taskFields.Note;
  const User = Models.User;

  const MaterialService = require('./material-service')(Models);

  async function _getTaskById(id) {
    return await Task.findByPk(id);
  }

  // GET

  async function _getSolutionObj(solution) {
    const obj = {
      body: solution.body,
      grade: solution.grade,
      themes: []
    };
    const themes = await solution.getThemes({
      order: [
        ['name', 'ASC']
      ] 
    });
    if (themes) {
      for (const theme of themes) {
        obj.themes.push(theme.id);
      }
    }
    return obj;
  }

  async function _getSolutionsObjArr(task) {
    const solutions = await task.getSolutions({
      order: [
        ['index', 'ASC']
      ]
    });
    const arr = [];
    for (const solution of solutions) {
      arr.push(await _getSolutionObj(solution));
    }
    return arr;
  }

  async function _getNotesObjArr(task) {
    return (await task.getNotes({
      attributes: [
        'type', 'label', 'body'
      ],
      order: [
        ['index', 'ASC']
      ]
    })).map(tmp => tmp.get({plain: true}));
  }

  async function _getTaskObj(id) {
    const task = await Task.findByPk(id);
    const materialId = task.materialId;
    const material = await task.getMaterial();
    return {
      statement: task.statement,
      answer: task.answer,
      solutions: await _getSolutionsObjArr(task),
      notes: await _getNotesObjArr(task),
      access: await MaterialService.getAccessRules(materialId),
      creationDate: await MaterialService.getCreationDate(materialId),
      author: await MaterialService.getAuthor(materialId),
      comments: await MaterialService.getComments(materialId),
      versions: await MaterialService.getVersionTree(material.baseId),
      changeComment: material.changeComment,
      usage: "TODO: usage"
    };
  }

  // CREATE

  async function _addSolution(task, solutionObj, index) {
    const solution = await task.createSolution({
      body: solutionObj.body,
      grade: solutionObj.grade,

      index: index
    });
    for (themeId of solutionObj.themes) {
      await solution.addTheme(await Theme.findByPk(themeId));
    }
  }

  async function _addNote(task, noteObj, index) {
    await task.createNote({
      type: noteObj.type,
      label: noteObj.label,
      body: noteObj.body,

      index: index
    });
  }

  async function _createTaskImpl(obj, authorId, materialId) {
    const task = await Task.create({
      statement: obj.statement,
      answer: obj.answer,
      // links
      materialId: materialId,
      authorId: authorId
    });
    for (solutionIndex in obj.solutions) {
      await _addSolution(task, obj.solutions[solutionIndex], solutionIndex);
    }
    for (noteIndex in obj.notes) {
      await _addNote(task, obj.notes[noteIndex], noteIndex);
    }
    await MaterialService.addAccessRules(materialId, obj.access);
    return task;
  }

  async function _createTask(obj, authorId) {
    const material = await MaterialService.createMaterial(authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, material.id);
  }

  async function _addVersion(obj, baseId, authorId) {
    const material = await MaterialService.addVersion(baseId, authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, material.id);
  }

  async function _addChange(obj, taskId, authorId) {
    const task = await Task.findByPk(taskId);
    const material = await task.getMaterial();
    const updatedMaterial = await MaterialService.addChange(
        material.baseId, material.versionId, authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, updatedMaterial.id);
  }

  return {
    getTaskById: _getTaskById,
    getTaskObj: _getTaskObj,
    getUserAccessTypeId: async (taskId, userId) => {
      const task = await Task.findByPk(taskId);
      return await MaterialService.getUserAccessTypeId(task.materialId, userId);
    },

    // CREATE
    createTask: _createTask,
    addVersion: _addVersion,
    addChange: _addChange
  }
};