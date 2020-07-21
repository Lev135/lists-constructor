module.exports = (sequelize, DataTypes) => {
  const models = {
    User: require('./user')(sequelize, DataTypes),
    Role: require('./role')(sequelize, DataTypes),
    tags: require('./tags/tags')(sequelize, DataTypes),
    materials: require('./materials/materials')(sequelize, DataTypes),
    access: require('./access/access')(sequelize, DataTypes)
  };

  ///////////////////// Tags ////////////////////////////

  // Task solution  <-> Theme many-many link (through SolutionTheme)
  models.materials.taskFields.Solution.belongsToMany(
    models.tags.Theme, {
      through: "SolutionTheme",
      as: 'themes'
    });
  models.tags.Theme.belongsToMany(
    models.materials.taskFields.Solution, {
      through: "SolutionTheme",
      as: 'solutions'
    });

  // Source <-- Task one-many link
  models.tags.Source.hasMany(models.materials.Task, {
    as: 'tasks',
    foreignKey: {
      name: 'sourceId',
      allowNull: true,
    }
  });
  models.materials.Task.belongsTo(models.tags.Source, {
    as: 'source'
  });

  //////////// Access rules and user roles /////////////////

  // Role <-- User one-many link
  models.Role.hasMany(models.User, {
    as: 'users',
    foreignKey: {
      name: 'roleId',
      allowNull: false
    }
  });
  models.User.belongsTo(models.Role, {
    as: 'role'
  });

  // UserAccessRule -> User, AccessType, Material many-one links

  models.access.UserAccessRule.belongsTo(models.User, {
    as: 'user'
  });
  models.access.UserAccessRule.belongsTo(models.access.AccessType, {
    as: 'type'
  });
  models.access.UserAccessRule.belongsTo(models.materials.Material, {
    as: 'material'
  });
  models.User.hasMany(models.access.UserAccessRule, {
    as: 'access-rules',
    foreignKey: {
      name: 'userId',
      allowNull: false
    }
  });
  models.access.AccessType.hasMany(models.access.UserAccessRule, {
    as: 'user-access-rules',
    foreignKey: {
      name: 'typeId',
      allowNull: false
    }
  });
  models.materials.Material.hasMany(models.access.UserAccessRule, {
    as: 'user-access-rules',
    foreignKey: {
      name: 'materialId',
      allowNull: false
    }
  });

  // RolelAccessRule -> Role, AccessType, Material many-one-links

  models.access.RoleAccessRule.belongsTo(models.Role, {
    as: 'role'
  });
  models.access.RoleAccessRule.belongsTo(models.access.AccessType, {
    as: 'type'
  });
  models.access.RoleAccessRule.belongsTo(models.materials.Material, {
    as: 'material'
  });
  models.Role.hasMany(models.access.RoleAccessRule, {
    as: 'access-rules',
    foreignKey: {
      name: 'roleId',
      allowNull: false
    }
  });
  models.access.AccessType.hasMany(models.access.RoleAccessRule, {
    as: 'role-access-rules',
    foreignKey: {
      name: 'typeId',
      allowNull: false
    }
  });
  models.materials.material.hasMany(models.access.RoleAccessRule, {
    as: 'role-access-rules',
    foreignKey: {
      name: 'materialId',
      allowNull: false
    }
  });
  return models;
};
