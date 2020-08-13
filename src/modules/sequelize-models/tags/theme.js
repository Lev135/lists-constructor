module.exports = (sequelize, DataTypes) => {
  const Theme = sequelize.define('Theme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Theme;
};
