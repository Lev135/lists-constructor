module.exports = (sequelize, DataTypes) => {
  const access = {
    AccessType: require('./access-type')(sequelize, DataTypes),
    UserAccessRule: require('./user-access-rule')(sequelize, DataTypes),
    RoleAccessRule: require('./role-access-rule')(sequelize, DataTypes)
  };

  return access;
};
