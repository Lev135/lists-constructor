module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TaskList', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.INTEGER
    },
    creatorId: {
      type: DataTypes.INTEGER
    }
    // logo: {
    //   type: DataTypes.
    // },

  });
};
