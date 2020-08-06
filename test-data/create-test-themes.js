const themeObjects = [
  {
    id: 1,
    name: "Theme 1",
    subtags: [
      {
        id: 2,
        name: "Theme 1.1",
        subtags: [
          {
            id: 3,
            name: "Theme 1.1.1"
          }
        ]
      },
      {
        id: 4,
        name: "Theme 1.2"
      }
    ]
  },
  {
    id: 5,
    name: "Theme 2"
  }
];

module.exports = async (Models) => {
  const ThemeService = require('../modules/services/tag-service')
                                (Models.tags.Theme);
  await ThemeService.insertAllFromObjects(themeObjects);
  const themes = await Models.tags.Theme.findAll({raw: true});
  console.log("THEMES", themes);
  const arr = await ThemeService.allToObjects();
  console.log("THEMES", JSON.stringify(arr, null, 2));
};
