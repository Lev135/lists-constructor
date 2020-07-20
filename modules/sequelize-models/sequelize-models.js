module.exports = (sequelize, DataTypes) => {
  const models = {
    User: require('./user')(sequelize, DataTypes),
    tags: require('./tags/tags')(sequelize, DataTypes),
    materials: require('./materials/materials')(sequelize, DataTypes),
  };
  // Other links
  models.User.hasMany(models.materials.Material, {onDelete: "set null"});
  models.User.hasMany(models.materials.UserAccessRule, {onDelete: "cascade"});
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


  return models;
};
