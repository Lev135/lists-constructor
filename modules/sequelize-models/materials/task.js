module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    statement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type: DataTypes.STRING
      // null for 'prove' tasks
    },
    solution: {
      type: DataTypes.STRING
    },
    grade: {
      type: DataTypes.INTEGER
    }
  });
};
