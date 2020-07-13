module.exports = (sequelize, DataTypes) => {
  return {
    User: require('./user')(sequelize, DataTypes),
    materials: require('./materials/materials')(sequelize, DataTypes),
    tags: require('./tags/tags')(sequelize, DataTypes)
  };
};
