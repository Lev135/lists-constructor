module.exports = (sequelize, DataTypes) => {
  return {
    CommentBlock: require('./comment-block')(sequelize, DataTypes),
    TasksBlock: require('./tasks-block')(sequelize, DataTypes)
  };
};
