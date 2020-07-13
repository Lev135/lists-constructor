module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Material', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN
    },
    isAllUserAccess : {
      type: DataTypes.BOOLEAN
    }
  });
};
