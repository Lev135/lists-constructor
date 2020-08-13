module.exports = (Models) => {
  Models.tags.Source.create({name: "root"})
    .then(root => {
      return root.createSubtag({name: "Source 1"});
    })
    .then(theme1 => {
      return theme1.createSubtag({name: "Source 1.1"});
    })
    .then(() => {
      return Models.tags.Source.findAll({raw: true});
    })
    .then((sources) => {
      /*console.log("SOURCES", sources);*/
      const ThemeWrapper = require('../modules/models-wrappers/tag-wrapper')
                                    (Models.tags.Source);
      return ThemeWrapper.allToObjects();
    })
    .then(arr => null /*console.log("SOURCES", JSON.stringify(arr, null, 2))*/)
    .catch(err => console.log(err));

};
