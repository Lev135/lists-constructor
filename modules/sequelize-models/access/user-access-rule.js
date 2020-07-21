module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserAccessRule', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }
  });
};
