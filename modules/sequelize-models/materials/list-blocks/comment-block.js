module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CommentBlock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
