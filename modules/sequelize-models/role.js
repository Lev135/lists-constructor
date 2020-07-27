module.exports = (sequelize, DataTypes) => {
  return sequelize.define('RoleType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
