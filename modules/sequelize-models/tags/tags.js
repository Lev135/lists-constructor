module.exports = (sequelize, DataTypes) => {
  return {
    Theme: require('./theme')(sequelize, DataTypes),
    Method: require('./method')(sequelize, DataTypes),
    Source: require('./source')(sequelize, DataTypes)
  };
};
