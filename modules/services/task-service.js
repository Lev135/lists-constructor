module.exports = (Models) => {
  const Task = Models.materials.Task;
  const Solution = Models.materials.taskFields.Solution;
  const Theme = Models.tags.Theme;
  const Note = Models.materials.taskFields.Note;
  const User = Models.User;

  const userAttributes = [
    'id', 'name', 'surname', 'patronymic', 'email', 'roleId'
  ];

  const MaterialService = require('./material-service')(Models);

  async function _getTaskById(id) {
    return await Task.findByPk(id);
  }

  async function _getTaskObj(id) {
    const query = {
      attributes: [
        'statement', 'answer'
      ],
      include: [
        {
          model: Solution,
          as: 'solutions',
          attributes: [
            'body', 'grade'
          ],
          order: [
            ['index', 'ASC']
          ],
          include: [
            {
              model: Theme,
              as: 'themes',
              attributes: [
                'id'
              ]
            }
          ]
        },
        {
          model: Note,
          as: 'notes',
          attributes: [
            'type', 'label', 'body'
          ],
          order: [
            ['index', 'ASC']
          ]
        }
      ]
    }
    const task = await Task.findByPk(id);
    const obj = (await Task.findByPk(id, query)).get({plain: true});
    obj.access = await MaterialService.getAccessRules(task.materialId);
    obj.creationDate = await MaterialService.getCreationDate(task.materialId);
    obj.author = await MaterialService.getAuthor(task.materialId);
    obj.comments = await MaterialService.getComments(task.materialId);
    obj.versions = await MaterialService.getVersionTree(
      (await task.getMaterial()).baseId);
    obj.usage = "TODO: usage";
    return obj;
  }

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
    material = await MaterialService.createMaterial(authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, material.id);
  }

  async function _addVersion(obj, baseId, authorId) {
    material = await MaterialService.addVersion(baseId, authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, material.id);
  }

  async function _addChange(obj, baseId, versionId, authorId) {
    material = await MaterialService.addChange(baseId, versionId, authorId, obj.changeComment);
    return await _createTaskImpl(obj, authorId, material.id);
  }

  return {
    getTaskById: _getTaskById,
    getTaskObj: _getTaskObj,

    // CREATE
    createTask: _createTask,
    addVersion: _addVersion,
    addChange: _addChange
  }
};