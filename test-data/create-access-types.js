const accessTypeNames = [
  'no-access',
  'pupil-access',
  'teacher-access',
  'editor-access',
  'moderator-access',
  'admin-access'
];


module.exports = async (Models) => {
  const AccessType = Models.access.AccessType;
  for (const accessTypeI in accessTypeNames) {
    await AccessType.create({
      id: accessTypeI,
      name: accessTypeNames[accessTypeI]
    });
  }
};