module.exports = (Models) => {
  Models.tags.Theme.create({name: "root"})
    .then(root => {
      return root.createSubtag({name: "Theme 1"});
    })
    .then(theme1 => {
      return theme1.createSubtag({name: "Theme 1.1"});
    })
    .then(() => {
      const ThemeWrapper = require('../modules/models-wrappers/tag-wrapper')
                                    (Models.tags.Theme);
      ThemeWrapper.allToObjects
        .then(arr => console.log(JSON.stringify(arr, null, 2)))
        .catch(err => console.error(err));
    })
    .catch(err => console.log(err));

};
