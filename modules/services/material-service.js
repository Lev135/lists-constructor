module.exports = (Models) => {
  const Material = Models.materials.Material;
  const UserAccessRule = Models.access.UserAccessRule;
  const RoleAccessRule = Models.access.RoleAccessRule;
  const User = Models.User;

  const userAttributes = [
    'id', 'name', 'surname', 'patronymic', 'email', 'roleId'
  ];
  /// GET 

  async function getMaterialById(id) {
    return await Material.findByPk(id);
  }
  async function getVersions(baseId) {
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
  async function getChanges(baseId, versionId) {
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
  async function getVersionTree(baseId) {
    const versionTree = await getVersions(baseId);
    for (versionObj of versionTree) {
      versionObj.changes = await getChanges(baseId, versionObj.versionId);
    }
    return versionTree;
  }

  /// CREATE

  async function createMaterial(authorId, changeComment) {
    const lastId = await Material.max('baseId');
    const baseId = isNaN(lastId) ? 1 : lastId + 1;
    return await addVersion(baseId, authorId, changeComment);
  }
  async function addVersion(baseId, authorId, changeComment) {
    const lastId = await Material.max('versionId', { 
      where : {
        baseId: baseId
      }
    });
    const versionId = isNaN(lastId) ? 1 : lastId + 1;
    return addChange(baseId, versionId, authorId, changeComment);
  }
  async function addChange(baseId, versionId, authorId, changeComment) {
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

  // ACCESS FUNCTIONS

  async function getUserAccessTypeId(materialId, userId) {
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

  async function getRoleAccessRules(material) {
    const rolesAccessQuery = {
      attributes: [
        'roleId', 'typeId'
      ]
    }
    return (await material.getRoleAccessRules(rolesAccessQuery))
                            .map(tmp => tmp.get({plain: true}));
  }

  async function getUserAccessRoles(material) {
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

  async function getAccessRules(materialId) {
    const material = await Material.findByPk(materialId);
    if (!material) {
      throw `Материал с id ${materialId} не найден`;
    }
    const [
      roles,
      users
    ] = await Promise.all([
      getRoleAccessRules(material),
      getUserAccessRoles(material)
    ]);
    return {
      roles,
      users 
    };
  }

  async function clearRoleAccessRules(materialId) {
    await RoleAccessRule.destroy({
      where: {
        materialId: materialId
      }
    });
  }

  async function clearUserAccessRules(materialId) {
    await UserAccessRule.destroy({
      where: {
        materialId: materialId
      }
    });
  }

  async function clearAccessRules(materialId) {
    await Promise.all([
      clearRoleAccessRules(materialId), 
      clearUserAccessRules(materialId)
    ]);
  }

  async function addRoleAccessRules(materialId, roleRulesObj) {
    const promises = [];
    for (rule of roleRulesObj) {
      promises.push(RoleAccessRule.create({
        materialId: materialId,
        roleId: rule.roleId,
        typeId: rule.typeId
      }));
    }
    await Promise.all(promises);
  }

  async function addUserAccessRules(materialId, userRulesObj) {
    const promises = [];
    for (rule of userRulesObj) {
      promises.push(UserAccessRule.create({
        materialId: materialId,
        userId: rule.userId,
        typeId: rule.typeId
      }));
    }
    await Promise.all(promises);
  }

  async function addAccessRules(materialId, rulesObj) {
    await Promise.all([
      addRoleAccessRules(materialId, rulesObj.roles),
      addUserAccessRules(materialId, rulesObj.users)
    ]);
  }

  async function setAccessRules(materialId, rulesObj) {
    await Promise.all([
      clearAccessRules(materialId),
      addAccessRules(materialId, rulesObj)
    ]);
  }

  // OTHER FUNCTIONS

  async function getCreationDate(materialId) {
    return (await Material.findByPk(materialId)).createdAt;
  }

  async function getAuthor(materialId) {
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
    return (await Material.findByPk(materialId, query)).get({plain: true}).author;
  }

  async function getComments(materialId) {
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
    return (await Material.findByPk(materialId, query)).get({plain: true}).comments;
  }

  return {
    // version getters:
    getMaterialById,
    getVersions,
    getChanges,
    getVersionTree,
    // version create-functions
    createMaterial,
    addVersion,
    addChange,
    // accesss functions
    getUserAccessTypeId,
    getAccessRules,
    addAccessRules,
    setAccessRules,
    clearAccessRules,
    // other functions
    getCreationDate,
    getAuthor,
    getComments
  }
};