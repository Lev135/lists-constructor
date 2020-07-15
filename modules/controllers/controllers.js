module.exports = (Models, passport) => ({
  UserController: require('./user-controller')(Models, passport)
});
