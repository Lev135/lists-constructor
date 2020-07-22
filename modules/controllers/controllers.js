module.exports = (Models, passport) => ({
  UserController: require('./user-controller')(Models, passport),
  TaskController: require('./task-controller')(Models, passport),    // Сдесь нужен passport? Включил его на всякий случай
  TestController: require('./test-controller')(Models)
});
