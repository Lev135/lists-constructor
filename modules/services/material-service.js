module.exports = (Models) => {
  const Material = Models.materials.Material;
  const UserAccessRule = Models.access.UserAccessRule;
  const RoleAccessRule = Models.access.RoleAccessRule;
  const User = Models.User;

  const userAttributes = [
    'id', 'name', 'surname', 'patronymic', 'email', 'roleId'
  ];
  /// GET 

  async function _getMaterialById(id) {
    return await Material.findByPk(id);
  }
  async function _getVersions(baseId) {
    const query = {
      where: {
        baseId: baseId,
        changeId: 0
      },
      attributes: [
        'id', 'versionId', 'changeComment'
      ],
      order: [
        ['versionId', 'ASC']
      ],
      include: [
        {
          model: Models.User,
          as: 'author',
          attributes: userAttributes
        }
      ]
    }
    return (await Material.findAll(query)).map(data => data.get({plain: true}));
  }
  async function _getChanges(baseId, versionId) {
    const query = {
      where: {
        baseId: baseId,
        versionId: versionId
      },
      attributes: [
        'id', 'changeId', 'changeComment'
      ],
      order: [
        ['changeId', 'ASC']
      ],
      include: [
        {
          model: Models.User,
          as: 'author',
          attributes: userAttributes
        }
      ]
    };
    return (await Material.findAll(query)).map(data => data.get({plain: true}));
  }
  async function _getVersionTree(baseId) {
    const versionTree = await _getVersions(baseId);
    for (versionObj of versionTree) {
      versionObj.changes = await _getChanges(baseId, versionObj.versionId);
    }
    return versionTree;
  }

  /// CREATE

  async function _createMaterial(authorId, changeComment) {
    const lastId = await Material.max('baseId');
    const baseId = isNaN(lastId) ? 1 : lastId + 1;
    return await _addVersion(baseId, authorId, changeComment);
  }
  async function _addVersion(baseId, authorId, changeComment) {
    const lastId = await Material.max('versionId', { 
      where : {
        baseId: baseId
      }
    });
    const versionId = isNaN(lastId) ? 1 : lastId + 1;
    return _addChange(baseId, versionId, authorId, changeComment);
  }
  async function _addChange(baseId, versionId, authorId, changeComment) {
    const lastId = await Material.max('changeId', {
      where : {
        baseId: baseId,
        versionId: versionId
      }
    });
    const newMaterial = {
      baseId: baseId,
      versionId: versionId,
      changeId: isNaN(lastId) ? 0 : lastId + 1,
      changeComment: changeComment,
      authorId: authorId
    }
    return await Material.create(newMaterial);
  }

  /// TO OBJECT

  async function _toObjectById(id) {
    return await Material.findByPk(id, {
      attributes : [
        'materialId', 'versionId', 'changeId', 'changeComment'
      ],
      include : [
        {
          model : Models.User,
          as : 'author',
          attributes : userAttributes
        }
      ]
    });
  }
  
  // ACCESS FUNCTIONS

  async function _getUseraccessTypeId(materialId, userId) {
    const personalAccess = await UserAccessRule.findOne({
      where : {
        materialId : materialId,
        userId : userId
      },
      attributes : [
        'typeId'
      ]
    });
    const personalAccessType = personalAccess ? personalAccess.typeId : 0;

    const roleId = (await User.findByPk(userId)).roleId;
    const roleAccess = await RoleAccessRule.findOne({
      where : {
        materialId : materialId,
        roleId : roleId
      },
      attributes : [
        'typeId'
      ]
    });
    const roleAccessType = roleAccess ? roleAccess.typeId : 0;
    return Math.max(personalAccessType, roleAccessType);
  }

  async function _getRoleAccessRules(material) {
    const rolesAccessQuery = {
      attributes: [
        'roleId', 'typeId'
      ]
    }
    return (await material.getRoleAccessRules(rolesAccessQuery))
                            .map(tmp => tmp.get({plain: true}));
  }

  async function _getUserAccessRoles(material) {
    const usersAccessQuery = {
      attributes: [
        'typeId'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: userAttributes
        }        
      ]
    }
    return (await material.getUserAccessRules(usersAccessQuery))
                            .map(tmp => tmp.get({plain: true}));
  }

  async function _getAccessRules(materialId) {
    const material = await Material.findByPk(materialId);
    if (!material) {
      throw `Материал с id ${materialId} не найден`;
    }
    return {
      roles: await _getRoleAccessRules(material),
      users: await _getUserAccessRoles(material)
    };
  }

  async function _clearRoleAccessRules(materialId) {
    await RoleAccessRule.destroy({
      where: {
        materialId: materialId
      }
    });
  }

  async function _clearUserAccessRules(materialId) {
    await UserAccessRule.destroy({
      where: {
        materialId: materialId
      }
    });
  }

  async function _clearAccessRules(materialId) {
    await _clearRoleAccessRules(materialId);
    await _clearUserAccessRules(materialId);
  }

  async function _addRoleAccessRules(materialId, roleRulesObj) {
    for (rule of roleRulesObj) {
      await RoleAccessRule.create({
        materialId: materialId,
        roleId: rule.roleId,
        typeId: rule.typeId
      });
    }
  }

  async function _addUserAccessRules(materialId, userRulesObj) {
    for (rule of userRulesObj) {
      await UserAccessRule.create({
        materialId: materialId,
        userId: rule.userId,
        typeId: rule.typeId
      });
    }
  }

  async function _addAccessRules(materialId, rulesObj) {
    await _addRoleAccessRules(materialId, rulesObj.roles);
    await _addUserAccessRules(materialId, rulesObj.users);
  }

  async function _setAccessRules(materialId, rulesObj) {
    await _clearAccessRules(materialId);
    await _addAccessRules(materialId, rulesObj);
  }

  // OTHER FUNCTIONS

  async function _getcreationDate(materialId) {
    return (await Material.findByPk(materialId)).createdAt;
  }

  async function _getAuthor(materialId) {
    const query = {
      attributes: [],
      include: [
        {
          model: User,
          as: 'author',
          attributes: userAttributes
        }
      ]
    }
    return (await Material.findByPk(materialId)).author;
  }

  async function _getComments(materialId) {
    const query = {
      attributes: [],
      include: [
        {
          model: Models.Comment,
          as: 'comments',
          attributes: [
            'body'
          ],
          order: [
            ['index', 'ASC']
          ],
          include: [
            {
              model: User,
              as: 'author',
              attributes: userAttributes
            }
          ]
        }
      ]
    };
    return (await Material.findByPk(materialId)).comments;
  }

  return {
    // version getters:
    getMaterialById : _getMaterialById,
    getVersions : _getVersions,
    getChanges : _getChanges,
    getVersionTree: _getVersionTree,
    // version create-functions
    createMaterial : _createMaterial,
    addVersion : _addVersion,
    addChange : _addChange,
    // accesss functions
    getUseraccessTypeId : _getUseraccessTypeId,
    getAccessRules : _getAccessRules,
    addAccessRules: _addAccessRules,
    setAccessRules: _setAccessRules,
    clearAccessRules: _clearAccessRules,
    // other functions
    getCreationDate: _getcreationDate,
    getAuthor: _getAuthor,
    getComments: _getComments
  }
};