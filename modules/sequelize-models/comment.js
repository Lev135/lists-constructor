module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  };
  