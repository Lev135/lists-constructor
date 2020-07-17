module.exports = (Models) => {
  require('./create-test-tasks')(Models);
  require('./create-test-themes')(Models);
  require('./create-test-users')(Models);
  require('./create-test-sources')(Models);
};
