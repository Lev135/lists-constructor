module.exports = (sequelize, DataTypes) => {
  const materials = {
    // Blocks for task lists
    listBlocks: require('./list-blocks/list-blocks')(sequelize, DataTypes),
    // Basic class for all materials
    Material: require('./material')(sequelize, DataTypes),
    // Materials. Implement Material (one-one link)
    Task: require('./task')(sequelize, DataTypes),
    TasksList: require('./tasks-list')(sequelize, DataTypes),
    Folder: require('./folder')(sequelize, DataTypes),
    // Access rules for materials
    AccessRule: require('./access-rule')(sequelize, DataTypes)
  };

  // Implementation links (child -> parent)
  materials.Task.belongsTo(materials.Material,
            {onDelete: "cascade"});
  materials.TasksList.belongsTo(materials.Material,
            {onDelete: "cascade"});
  materials.Folder.belongsTo(materials.Material,
            {onDelete: "cascade"});
  // Array -> Elements (one <- many) link
  materials.TasksList.hasMany(materials.listBlocks.ListBlock,
            {onDelete: "cascade"});
  // Other links
  materials.Material.hasMany(materials.AccessRule,
            {onDelete: "cascade"});
  materials.Folder.hasMany(materials.Material, {constraints: false});

  return materials;
};
