module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define('Source', {
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
  return Source;
};
