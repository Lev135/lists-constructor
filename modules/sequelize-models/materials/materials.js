module.exports = (sequelize, DataTypes) => {
  const materials = {
    // Blocks for task lists
    listBlocks: require('./list-blocks/list-blocks')(sequelize, DataTypes),
    // Complex fields for tasks
    taskFields: require('./task-fields/task-fields')(sequelize, DataTypes),
    // Basic class for all materials
    Material: require('./material')(sequelize, DataTypes),
    // Materials. Implement Material (one-one link)
    Task: require('./task')(sequelize, DataTypes),
    TasksList: require('./tasks-list')(sequelize, DataTypes),
    Folder: require('./folder')(sequelize, DataTypes),
    // Access rules for materials
    AccessRuleType: require('./access-rule-type')(sequelize, DataTypes),
    UserAccessRule: require('./user-access-rule')(sequelize, DataTypes)
  };

  // Implementation links (child -> parent)
  materials.Task.belongsTo(materials.Material,
            {onDelete: "cascade", allowNull: false});
  materials.TasksList.belongsTo(materials.Material,
            {onDelete: "cascade", allowNull: false});
  materials.Folder.belongsTo(materials.Material,
            {onDelete: "cascade", allowNull: false});
  // Array -> Elements (one <- many) link
  materials.Task.hasMany(materials.taskFields.Note, {
    as: 'notes',
    foreignKey: {
      name: 'taskId',
      allowNull: false
    }
  });
  materials.taskFields.Note.belongsTo(materials.Task, {
    as: 'task',
  });

  materials.Task.hasMany(materials.taskFields.Solution, {
    as: 'solutions',
    foreignKey: {
      name: 'taskId',
      allowNull: false
    }
  });
  materials.taskFields.Solution.belongsTo(materials.Task, {
    as: 'task',
  });

  materials.TasksList.hasMany(materials.listBlocks.ListBlock, {
    onDelete: "cascade",
    as: 'blocks',
    foreignKey: {
      name: 'tasksListId',
      allowNull: false
    }
  });
  // Other links
  materials.Material.hasMany(materials.UserAccessRule);
  materials.AccessRuleType.hasMany(materials.UserAccessRule);

  materials.Folder.hasMany(materials.Material, {constraints: false});

  return materials;
};
