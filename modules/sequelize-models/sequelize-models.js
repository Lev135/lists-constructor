module.exports = (sequelize, DataTypes) => {
  return {
    TaskList: require('./tasks-list')(sequelize, DataTypes),
    User: require('./user')(sequelize, DataTypes),
    ListBlocks: require('./list-blocks/list-blocks')(sequelize, DataTypes)
  };
};
