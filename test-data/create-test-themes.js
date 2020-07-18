const themes = [
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

module.exports = (Models) => {
  const ThemeWrapper = require('../modules/models-wrappers/tag-wrapper')
                                (Models.tags.Theme);
  ThemeWrapper.insertAllFromObjects(themes)
    .then(() => {
      return Models.tags.Theme.findAll({raw: true});
    })
    .then((themes) => {
      console.log("THEMES", themes);
      return ThemeWrapper.allToObjects();
    })
    .then(arr => console.log("THEMES", JSON.stringify(arr, null, 2)))
    .catch(err => console.error("ERROR", err));
};
