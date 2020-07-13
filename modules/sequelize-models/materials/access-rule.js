module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AccessRule', {
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
