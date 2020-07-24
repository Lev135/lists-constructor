module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RoleAccessRule', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }
  });
};
