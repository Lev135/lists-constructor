module.exports = async (Models) => {
//  require('./create-test-tasks')(Models);
  require('./create-test-themes')(Models);
  await require('./create-roles')(Models);
  await require('./create-access-types')(Models);
  await require('./create-test-users')(Models);
  require('./create-test-sources')(Models);
  require('./create-test-materials')(Models);
};
