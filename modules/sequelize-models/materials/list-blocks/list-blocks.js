module.exports = (sequelize, DataTypes) => {
  const listBlocks = {
    // Basic class for all list's blocks
    ListBlock: require('./list-block')(sequelize, DataTypes),
    // List's blocks. Implement ListBlock (one-one link)
    CommentBlock: require('./comment-block')(sequelize, DataTypes),
    TasksBlock: require('./tasks-block')(sequelize, DataTypes),
    // Item of tasks array in TasksBlock
    TaskItem: require('./task-item')(sequelize, DataTypes)
  };

  // Implementation links (child -> parent)
  listBlocks.CommentBlock.belongsTo(listBlocks.ListBlock,
            {onDelete: "cascade"});
  listBlocks.TasksBlock.belongsTo(listBlocks.ListBlock,
            {onDelete: "cascade"});
  // Array -> Elements (one <- many) link
  listBlocks.TasksBlock.hasMany(listBlocks.TaskItem,
            {onDelete: "cascade"});

  return listBlocks;
};
