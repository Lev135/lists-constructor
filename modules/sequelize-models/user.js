module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patronymic: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    registrationDate: {
      type: DataTypes.DATE
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isTeacher: {
      type: DataTypes.BOOLEAN
    },
    isEditor: {
      type: DataTypes.BOOLEAN
    },
    isAdmin: {
      type: DataTypes.BOOLEAN
    },
    telephone: {
      type: DataTypes.STRING
    }
  });
};
