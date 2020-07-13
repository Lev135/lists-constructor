module.exports = (sequelize, DataTypes) => {
  return {
    // Blocks for task lists
    listBlocks: require('./list-blocks/list-blocks')(sequelize, DataTypes),
    // Basic class for all materials
    Material: require('./material')(sequelize, DataTypes),
    // Materials. Implement Material (one-one link)
    Task: require('./task')(sequelize, DataTypes),
    TasksList: require('./tasks-list')(sequelize, DataTypes),
    Folder: require('./folder')(sequelize, DataTypes),
    // Access rules for materials
    AccessRules: require('./access-rules')(sequelize, DataTypes)
  };
};
