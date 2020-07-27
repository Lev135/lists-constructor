module.exports = (Models) => {
  const Task = Models.Task;
  const Solution = Models.materials.taskFields.Solution;
  const Theme = Models.tags.Theme;
  const Note = Models.materials.taskFields.Note;
  const User = Models.User;

  const userAttributes = [
    'id', 'name', 'surname', 'patronymic', 'email', 'roleId'
  ];

  const MaterialService = require('./material-service')(Models);

  async function _getTaskById(id) {
    return await Task.getElementByPk(id);
  }

  async function _getTaskObj(id) {
    const query = {
      attributes: [
        'statement', 'answer'
      ],
      include: [
        {
          model: Solution,
          as: 'solution',
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
            type, label, body
          ],
          order: [
            ['index', 'ASC']
          ]
        }
      ]
    }
    const task = Task.getElementByPk(id);
    const obj = Task.getElementByPk(id, query).get({plain: true});
    obj.access = MaterialService.getAccessRules(obj.materialId);
    obj.creationDate = MaterialService.getCreationDate(obj.materialId);
    obj.author = MaterialService.getAuthor(obj.materialId);
    obj.comments = MaterialService.getComments(obj.materialId);
    obj.versions = MaterialService.getVersionTree(obj.getMaterial().baseId);
    obj.usage = "TODO: usage";
  }

  return {
    getTaskById: _getTaskById
  }
};