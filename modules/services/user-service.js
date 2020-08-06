const Op = require('sequelize').Op;

const userAttributes = [
  'id', 'name', 'surname', 'patronymic', 'email', 'roleId'
];


module.exports = (Models) => {
  const User = Models.User;

  async function findUserByWord(word) {
    const fields = ['name', 'surname', 'patronymic', 'email'];
    const query = {
      where: {
        [Op.or] : []
      },
      limit: 10,
      attributes: userAttributes
    };
    for (const field of fields) {
      const tmp = {};
      tmp[field] = {
        [Op.like]: word + '%'
      }
      query.where[Op.or].push(tmp);
    }
    return (await User.findAll(query)).map(tmp => tmp.get({plain: true}));
  }

  async function findUsers(subStr) {
    return await findUserByWord(subStr);
  }

  return {
    userAttributes,
    findUsers
  }
};