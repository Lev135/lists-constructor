module.exports = Controllers => ({
  UserRouter : require('./user-router')(Controllers),
  TaskRouter: require('./task-router')(Controllers),
  TagRouter: require('./tag-router')(Controllers)
});
