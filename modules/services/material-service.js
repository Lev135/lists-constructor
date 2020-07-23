module.exports = (Models) => {
  const Material = Models.materials.Material;

  const userAttributes = [
    'id', 'name', 'surname', 'patronymic', 'email'
  ];
  /// GET 

  async function _getMaterialById(id) {
    return await Material.getElementByPk(id);
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

  async function _createMaterial(author, changeComment) {
    const lastId = await Material.max('baseId');
    const baseId = isNaN(lastId) ? 1 : lastId + 1;
    return await _addVersion(baseId, author, changeComment);
  }
  async function _addVersion(baseId, author, changeComment) {
    const lastId = await Material.max('versionId', { 
      where : {
        baseId: baseId
      }
    });
    const versionId = isNaN(lastId) ? 1 : lastId + 1;
    return _addChange(baseId, versionId, author, changeComment);
  }
  async function _addChange(baseId, versionId, author, changeComment) {
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
      changeComment: changeComment
    }
    console.log("MATERIAL", newMaterial);
    return await author.createMaterial(newMaterial, changeComment);
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
  
  ///// ACCESS FOR USERS //////

  async function _addUserAccessRuleByIds(materialId, userId, accessTypeId) {
    return await Models.access.UserAccessRule.create({
      materialId : materialId,
      userId : userId,
      typeId : accessTypeId
    });
  }

  async function _getUserAccessRulesById(materialId) {
    return await Models.access.UserAccessRule.findAll({
      where : {
        materialId : materialId
      },
      group : [
        'typeId'
      ],
      attributes : [
        'typeId' 
      ],
      include : [
        {
          model : Models.User,
          as : 'user',
          attributes : [
            'id', 'name', 'surname', 'patronomyc', 'email'
          ]
        }
      ]
    });
  }

  async function _removeUserAccessRuleByIds(materialId, userId, accessTypeId) {
    return await Models.access.UserAccessRule.destroy({
      where : {
        materialId : materialId,
        userId : userId,
        typeId : accessTypeId
      }
    });
  }

  /////// ACCESS FOR ROLES /////

  async function _addRoleAccessRuleByIds(materialId, roleId, accessTypeId) {
    return await Models.access.RoleAccessRule.create({
      materialId : materialId,
      roleId : roleId,
      typeId : accessTypeId
    });
  }

  async function _getRoleAccessRulesById(materialId) {
    return await Models.access.RoleAccessRule.findAll({
      where : {
        materialId : materialId
      },
      group : [
        'typeId'
      ],
      attributes : [
        'typeId', 'roleId'
      ]
    });
  }

  async function _removeRoleAccessRuleByIds(materialId, roleId, accessTypeId) {
    return await Models.access.UserAccessRule.destroy({
      where : {
        materialId : materialId,
        roleId : roleId,
        typeId : accessTypeId
      }
    });
  }

  async function _getUserAccessTypeIdByIds(materialId, userId) {
    const personalAccess = await Models.access.UserAccessRule.findOne({
      where : {
        materialId : materialId,
        userId : userId
      },
      attributes : [
        typeId
      ]
    });
    const personalAccessType = personalAccess ? personalAccess.typeId : 0;

    const roleId = await Models.User.findByPk(userId).roleId;
    const roleAccess = await Models.access.RoleAccessRule.findOne({
      where : {
        materialId : materialId,
        roleId : roleId
      },
      attributes : [
        typeId
      ]
    });
    const roleAccessType = roleAccess ? roleAccess.typeId : 0;
    return max(personalAccessType, roleAccessType);
  }


  return {
    getMaterialById : _getMaterialById,
    getVersions : _getVersions,
    getChanges : _getChanges,
    getVersionTree: _getVersionTree,
    createMaterial : _createMaterial,
    addVersion : _addVersion,
    addChange : _addChange,
    toObject : _toObjectById,

    addUserAccessRule : _addUserAccessRuleByIds,
    getUserAccessRules : _getUserAccessRulesById,
    removeUserAccessRules : _removeUserAccessRuleByIds,

    addRoleAccessRule : _addRoleAccessRuleByIds,
    getRoleAccessRules : _getRoleAccessRulesById,
    removeRoleAccessRule : _removeRoleAccessRuleByIds,

    getUserAccessTypeId : _getUserAccessTypeIdByIds
  }
};