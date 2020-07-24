const accessTypeNames = [
  'no-access',
  'simple-access',
  'editor-access',
  'moderator-access'
];


module.exports = async (Models) => {
  const AccessType = Models.access.AccessType;
  for (const accessTypeName of accessTypeNames) {
    await AccessType.create({
      name: accessTypeName
    });
  }
};