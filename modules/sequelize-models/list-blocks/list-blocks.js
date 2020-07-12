module.exports = (sequelize, DataTypes) => {
  return {
    CommentBlock: require('./comment-block')(sequelize, DataTypes),
    TaskBlock: require('./tasks-block')(sequelize, DataTypes)
  };
};
