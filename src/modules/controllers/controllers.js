module.exports = (Models, passport) => ({
  UserController: require('./user-controller')(Models, passport),
  TaskController: require('./task-controller')(Models),
  TagController: require('./tag-controller')(Models)
});
