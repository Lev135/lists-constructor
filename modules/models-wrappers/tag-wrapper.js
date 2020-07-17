module.exports = (Tag, tagname) => {
  function _tagToObject(tag) {
    return new Promise((resolve, reject) => {
      const obj = {
        id: tag.id,
        name: tag.name,
        subtags: []
      };
      tag.getSubtag()
        .then(subTags => {
          const promises = [];
          for (const subTagI in subTags) {
            const subTag = subTags[subTagI];
            const promise = _tagToObject(subTag);
            promise
              .then(subObj => {
                obj.subtags[subTagI] = subObj;
              });
            promises.push(promise);
          }
          Promise.all(promises)
            .then(() => resolve(obj))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
  TagWrapper = {
    tagToObject: _tagToObject,
    allToObjects:  new Promise((resolve, reject) => {
      Tag.findByPk(1)
        .then(root => {
          return _tagToObject(root);
        })
        .then(obj => {
          resolve(obj.subtags);
        })
        .catch(err => reject(err));
    })
  };
  return TagWrapper;
};
