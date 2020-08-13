module.exports = (sequelize, DataTypes) => {
  const tags = {
    Source: require('./source')(sequelize, DataTypes),
    Theme: require('./theme')(sequelize, DataTypes)
  };

  tags.Source.hasMany(tags.Source, {as: "Subtag", onDelete: "cascade"});
  tags.Theme.hasMany(tags.Theme, {as: "Subtag", onDelete: "cascade"});
  return tags;
};
