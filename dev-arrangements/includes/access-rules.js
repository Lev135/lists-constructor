// roleId -- id роли: 
// (0) -- anonymus (не зарегистрированный, 
//                  не передаётся в данном случае, 
//                  но может встретиться в других местах)
// 1 -- pupil (не подтверждённый)
// 2 -- teacher (подтверждённый)
// 3 -- editor
// 4 -- moderator 
// 5 -- admin (только один на сайте)

// typeId -- тип прав:
// (0) -- none-access (не передаётся в данном случае, 
//                     но может встетиться в других местах)
// 1 -- pupil-access (доступ только к просмотру условия и тэгов)
// 2 -- teacher-access (доступ к просмотру всей информации и созданию изменений версий)
// 3 -- editor-access (доступ к подтверждению изменений -- созданию новых версий)
// 4 -- moderator-access (доступ к назначению редакторов, 
//                        может быть у нескольких пользователей одновременно)
// 5 -- admin-access (доступ к назначению редакторов и модераторов,
//                    может быть только у одного человека одновременно,
//                    но admin может передать свои права другому пользователю)

/////////////////////////////////////////////////////////////////////////////
// Объект, выдаваемый странице при GET-запросе.
// Если какой-то роли нет в roles, то значит у неё 0 уровень доступа

const GET = {
  roles: [
    { roleId: 1, typeId: 1 },
    { roleId: 2, typeId: 2 },
    { roleId: 3, typeId: 2 },
    { roleId: 4, typeId: 2 },
    { roleId: 5, typeId: 2 }
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
        roleId: 5
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