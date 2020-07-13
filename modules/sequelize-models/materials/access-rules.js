module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AccessRules', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    isReadAccess: {
      type: DataTypes.BOOLEAN
    },
    isWriteAccess: {
      type: DataTypes.BOOLEAN
    }
  });
};
