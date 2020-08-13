const roleNames = [
  'anonymus',
  'pupil',
  'teacher',
  'editor',
  'moderator',
  'admin'
];


module.exports = async (Models) => {
  const Role = Models.Role;
  for (const roleI in roleNames) {
    await Role.create({
      id: roleI,
      name: roleNames[roleI]
    });
  }
};