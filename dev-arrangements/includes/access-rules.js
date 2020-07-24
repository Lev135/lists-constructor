// Объект, выдаваемый странице при GET-запросе.

// roleId -- id роли: 
// 1 -- pupil (не подтверждённый)
// 2 -- teacher (подтверждённый)
// 3 -- editor
// 4 -- admin

// typeId -- тип прав:
// (0) -- none-access (не передаётся в данном случае, 
//                     но может встетиться в других местах)
// 1 -- simple-access
// 2 -- editor-access
// 3 -- moderator-access

const GET = {
  roles: [
    {
      roleId: 1,
      typeId: 1
    },
    {
      roleId: 2,
      typeId: 2
    }
  ],
  users: [
    {
      typeId: 3,
      user: {
        id: 1,
        name: 'Иван',
        surname: 'Иванович',
        patronymic: 'Иванов',
        email: 'Иванов@test.ru',
        roleId: 1
      }
    },
    {
      typeId: 3,
      user: {
        id: 1,
        name: 'Иван',
        surname: 'Иванович',
        patronymic: 'Иванов',
        email: 'Иванов@test.ru',
        roleId: 1
      }
    },
    {
      typeId: 1,
      user: {
        id: 2,
        name: 'Пётр',
        surname: 'Петрович',
        patronymic: 'Петров',
        email: 'Петров@test.ru',
        roleId: 2
      }
    },
    {
      typeId: 1,
      user: {
        id: 3,
        name: 'Николай',
        surname: 'Иванович',
        patronymic: null,
        email: 'Николаев@test.ru',
        roleId: 3
      }
    },
    {
      typeId: 1,
      user: {
        id: 4,
        name: 'Админ',
        surname: 'Админов',
        patronymic: null,
        email: 'admin@a',
        roleId: 4
      }
    }
  ]
};

// Объект, передаваемый клиентом при POST-запросе.

const POST = {
  roles: [
      { roleId: 1, typeId: 1 },
      { roleId: 2, typeId: 2 }
  ],
  users: [
      { userId: 1, typeId: 3 },
      { userId: 2, typeId: 1 },
      { userId: 3, typeId: 1 },
      { userId: 4, typeId: 1 }
  ]
}