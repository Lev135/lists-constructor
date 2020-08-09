// Дерево версий. Имеет два уровня: версии (лежат во внешнем массиве) и изменения (во внутреннем)
// Версия, фактически = 0-вое изменение этой версии

// Любое изменение любого материала можно задать двумя способами:
// 1) id
// 2) baseId (фактически, id самого материала) + versionId + changeId 
// То есть id -- уникальный ключ среди всех изменений всех версий всех материалов.

const GET = [
  {
    id: 1, 
    versionId: 1,
    changeComment: 'Материал от пользователя №1',
    author: {
      id: 1,
      name: 'Иван',
      surname: 'Иванович',
      patronymic: 'Иванов',
      email: 'Иванов@test.ru',
      roleId: 1
    },
    changes: [
      {
        id: 5,
        changeId: 1,
        changeComment: 'Прекрасная фича от 2 пользователя',
        author: {
          id: 2,
          name: 'Пётр',
          surname: 'Петрович',
          patronymic: 'Петров',
          email: 'Петров@test.ru',
          roleId: 2
        }
      }
    ]
  },
  {
    id: 6,
    versionId: 2,
    changeComment: 'Добавлена прекрасная фича от 2 пользователя (#1.1.1)',
    author: {
      id: 1,
      name: 'Иван',
      surname: 'Иванович',
      patronymic: 'Иванов',
      email: 'Иванов@test.ru',
      roleId: 1
    },
    changes: [
      {
        id: 7,
        changeId: 1,
        changeComment: 'Новая прекрасная фича от 2 пользователя',
        author: {
          id: 2,
          name: 'Пётр',
          surname: 'Петрович',
          patronymic: 'Петров',
          email: 'Петров@test.ru',
          roleId: 2
        }
      }
    ]
  }
]