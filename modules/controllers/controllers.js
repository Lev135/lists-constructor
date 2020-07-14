module.exports = (Models) => ({
  UserController: require('./user-controller')(Models)
});
