module.exports = (sequelize, DataTypes) => {
  const taskFields = {
    Note: require('./note')(sequelize, DataTypes),
    Solution: require('./solution')(sequelize, DataTypes)
  };

  return taskFields;
};
