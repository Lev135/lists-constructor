module.exports = (sequelize, DataTypes) => {
  const models = {
    User: require('./user')(sequelize, DataTypes),
    tags: require('./tags/tags')(sequelize, DataTypes),
    materials: require('./materials/materials')(sequelize, DataTypes),
  };
  // Other links
  models.User.hasMany(models.materials.Material, {onDelete: "set null"});
  models.User.hasMany(models.materials.AccessRule, {onDelete: "cascade"});
  // Materials <-> Tags many-many link (through MaterialTag)
  models.materials.Material.belongsToMany(models.tags.Source, {through: "MaterialSource"});
  models.tags.Source.belongsToMany(models.materials.Material, {through: "MaterialSource"});
  models.materials.Material.belongsToMany(models.tags.Theme, {through: "MaterialTheme"});
  models.tags.Theme.belongsToMany(models.materials.Material, {through: "MaterialTheme"});


  return models;
};
