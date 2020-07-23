module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Material', {
    baseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    versionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    changeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    changeComment: { // comment for changes
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN
    }
  });
};
