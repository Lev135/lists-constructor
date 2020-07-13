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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING
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
    photo: {
      type: DataTypes.STRING
    },
    registrationDate: {
      type: DataTypes.DATE
    }
  });
};
