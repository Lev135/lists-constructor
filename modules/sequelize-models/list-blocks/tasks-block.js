module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TasksBlock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    taskIds: {
      type: DataTypes.INTEGER,
      unique: true
    }
  });
};
