module.exports = (Tag) => {
  async function tagToObject(tag) {
    const obj = {
      id: tag.id,
      name: tag.name,
      subtags: []
    };
    const subTags = await tag.getSubtag({
      order: [['name', 'ASC']]
    });
    const promises = [];
    for (const subTag of subTags) {
      promises.push(tagToObject(subTag));
    }
    const subTagsObjects = await Promise.all(promises);
    for (const subTagObj of subTagsObjects) {
      obj.subtags.push(subTagObj);
    }
    return obj;
  }

  async function insertTagFromObject(obj, parentTag) {
    if (!parentTag) {
      throw {message: "Null parent tag"};
    }
    const promises = [];
    const tag = await parentTag.createSubtag({name: obj.name});
    if (obj.subtags) {
      for (const subObj of obj.subtags) {
        promises.push(insertTagFromObject(subObj, tag));
      }
    }
    await Promise.all(promises);
  }

  return {
    tagToObject,
    allToObjects: async () => {
      const root = await Tag.findByPk(1);
      if (!root) {
        throw {message: "Null root in tag tree"};
      }
      const obj = await tagToObject(root);
      return obj.subtags;
    },

    insertTagFromObject,
    insertAllFromObjects: async (objects) => {
      const root = await Tag.create({/*id: 1,*/ name: "root"});
      const promises = [];
      for (const obj of objects) {
        promises.push(insertTagFromObject(obj, root));
      }
      await Promise.all(promises);
    }
  };
};
