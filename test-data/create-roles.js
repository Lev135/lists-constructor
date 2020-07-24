const roleNames = [
  'pupil',
  'teacher',
  'editor',
  'admin'
];


module.exports = async (Models) => {
  const Role = Models.Role;
  for (const roleName of roleNames) {
    await Role.create({
      name: roleName
    });
  }
};