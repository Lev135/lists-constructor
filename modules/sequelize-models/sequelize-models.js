module.exports = (sequelize, DataTypes) => {
  const models = {
    User: require('./user')(sequelize, DataTypes),
    Tag: require('./tag')(sequelize, DataTypes),
    materials: require('./materials/materials')(sequelize, DataTypes),
    MaterialTag: require('./material-tag')(sequelize, DataTypes)
  };
  // Other links
  models.User.hasMany(models.materials.Material, {onDelete: "set null"});
  models.User.hasMany(models.materials.AccessRule, {onDelete: "cascade"});
  // Materials <-> Tags many-many link (through MaterialTag)
  models.materials.Material.belongsToMany(models.Tag, {through: models.MaterialTag});
  models.Tag.belongsToMany(models.materials.Material, {through: models.MaterialTag});

  return models;
};
