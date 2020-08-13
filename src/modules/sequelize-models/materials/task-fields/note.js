module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Note', {
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
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
