module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TaskItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
