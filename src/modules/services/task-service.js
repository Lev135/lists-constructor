module.exports = (Models) => {
  const Task = Models.materials.Task;
  const Theme = Models.tags.Theme;

  const MaterialService = require('./material-service')(Models);

  // GET

  async function getSolutionObj(solution) {
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

  async function getSolutionsObjArr(task) {
    const solutions = await task.getSolutions({
      order: [
        ['index', 'ASC']
      ]
    });
    const promises = [];
    for (const solution of solutions) {
      promises.push(getSolutionObj(solution));
    }
    return await Promise.all(promises);
  }

  async function getNotesObjArr(task) {
    return (await task.getNotes({
      attributes: [
        'type', 'label', 'body'
      ],
      order: [
        ['index', 'ASC']
      ]
    })).map(tmp => tmp.get({plain: true}));
  }

  
  async function getImplementedChanges(material) {
    if (material.changeId != 0) {
      return [];
    }
    return await MaterialService.getImplementedChanges(material.baseId, material.versionId);
  }

  async function getTaskObj(id) {
    const task = await Task.findByPk(id);
    const materialId = task.materialId;
    const material = await task.getMaterial();
    const [
      solutions,
      notes,
      access,
      creationDate,
      author,
      comments,
      versions,
      implementedChanges,
      implementedInVersion
    ] = await Promise.all([
      getSolutionsObjArr(task),
      getNotesObjArr(task),
      MaterialService.getAccessRules(materialId),
      MaterialService.getCreationDate(materialId),
      MaterialService.getAuthor(materialId),
      MaterialService.getComments(materialId),
      MaterialService.getVersionTree(material.baseId),
      getImplementedChanges(material),
      MaterialService.getImplementedInVersion(material.baseId, material.versionId, material.changeId)
    ]);
    return {
      statement: task.statement,
      answer: task.answer,
      solutions,
      notes,
      access,
      creationDate,
      author, 
      comments,
      versions, 
      implementedChanges,
      implementedInVersion,
      changeComment : material.changeComment,
      usage : {TODO: "usage"}
    };
  }

  // CREATE

  async function addSolution(task, solutionObj, index) {
    const solution = await task.createSolution({
      body: solutionObj.body,
      grade: solutionObj.grade,

      index: index
    });
    for (themeId of solutionObj.themes) {
      await solution.addTheme(await Theme.findByPk(themeId));
    }
  }

  async function addNote(task, noteObj, index) {
    await task.createNote({
      type: noteObj.type,
      label: noteObj.label,
      body: noteObj.body,

      index: index
    });
  }

  async function createTaskImpl(obj, authorId, materialId) {
    const task = await Task.create({
      statement: obj.statement,
      answer: obj.answer,
      // links
      materialId: materialId,
      authorId: authorId
    });
    const promises = [];
    for (solutionIndex in obj.solutions) {
      promises.push(addSolution(task, obj.solutions[solutionIndex], solutionIndex));
    }
    for (noteIndex in obj.notes) {
      promises.push(addNote(task, obj.notes[noteIndex], noteIndex));
    }
    promises.push(MaterialService.addAccessRules(materialId, obj.access));
    await Promise.all(promises);
    return task;
  }

  async function createTask(obj, authorId) {
    const material = await MaterialService.createMaterial(authorId, obj.changeComment);
    return await createTaskImpl(obj, authorId, material.id);
  }

  async function addVersion(obj, taskId, authorId, implementedChangesTaskIds = []) {
    const promises = [];
    for (const changeTaskId of implementedChangesTaskIds) {
      promises.push(Task.findByPk(changeTaskId));
    }
    const materialIds = (await Promise.all(promises)).map(material => material.materialId);
    const task = await Task.findByPk(taskId);
    const material = await task.getMaterial(); 
    const updatedMaterial = await MaterialService.addVersion(
        material.baseId, authorId, obj.changeComment, materialIds);
    return await createTaskImpl(obj, authorId, updatedMaterial.id);
  }

  async function addChange(obj, taskId, authorId) {
    const task = await Task.findByPk(taskId);
    const material = await task.getMaterial();
    const updatedMaterial = await MaterialService.addChange(
        material.baseId, material.versionId, authorId, obj.changeComment);
    return await createTaskImpl(obj, authorId, updatedMaterial.id);
  }

  return {
    getTaskObj,
    getUserAccessTypeId: async (taskId, userId) => {
      const task = await Task.findByPk(taskId);
      return await MaterialService.getUserAccessTypeId(task.materialId, userId);
    },

    // CREATE
    createTask,
    addVersion,
    addChange
  }
};