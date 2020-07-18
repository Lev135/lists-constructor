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
          return Promise.all(promises);
        })
        .then(() => resolve(obj))
        .catch(err => reject(err));
    });
  }
  function _insertTagFromObject(obj, parentTag) {
    return new Promise((resolve, reject) => {
      if (!parentTag) {
        reject({message: "Null parent tag"});
      }
      const promises = [];
      parentTag.createSubtag({name: obj.name})
        .then(tag => {
          if (obj.subtags) {
            for (const subObj of obj.subtags) {
              promises.push(_insertTagFromObject(subObj, tag));
            }
          }
          return Promise.all(promises);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }
  TagWrapper = {
    tagToObject: _tagToObject,
    allToObjects: () => new Promise((resolve, reject) => {
      Tag.findByPk(1)
        .then(root => {
          if (!root) {
            return reject({message: "Null root in tag tree"});
          }
          return _tagToObject(root);
        })
        .then(obj => {
          resolve(obj.subtags);
        })
        .catch(err => reject(err));
    }),

    insertTagFromObject: _insertTagFromObject,
    insertAllFromObjects: (objects) => new Promise((resolve, reject) => {
      Tag.create({/*id: 1,*/ name: "root"})
        .then(root => {
          const promises = [];
          for (const obj of objects) {
            promises.push(_insertTagFromObject(obj, root));
          }
          return Promise.all(promises);
        })
        .then(() => resolve())
        .catch((err) => reject(err));
    })
  };
  return TagWrapper;
};
