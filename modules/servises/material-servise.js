module.exports = (Models) => {
  const Material = Models.materials.Material;
  async function _getMaterialById(id) {
    return await Material.getElementByPk(id);
  }
  async function _getVersions(material) {
    const query = {
      where: {
        materialId: material.materialId
      },
      attributes: [
        versionId
      ],
      order: [
        [versionId, 'ASC']
      ]
    }
    const materialVersions = await Material.findAll(query);
    return materialVersions; // Не будет ли повторов?
  }
  async function _getChanges(material) {
    const query = {
      where: {
        materialId: material.materialId,
        versionId: material.versionId
      },
      attributes: [
        changeId
      ],
      order: [
        [versionId, 'ASC']
      ]
    }
    const materialChanges = await Material.findAll(query);
    return materialChanges;
  }
  async function _createMaterial(author) {
    const material = {
      materialId: await Material.max('materialId') + 1 // Если материалов нет, что будет? Ошибка?
    }
    return await _addVersion(material, author);
  }
  async function _addVersion(material, author) {
    material.versionId = await Material.max('versionId', { 
      where : {
        materialId: material.materialId
      }
    }) + 1;
    return _addChange(material, author);
  }
  async function _addChange(material, author) {
    const newMaterial = {
      materialId: material.materialId,
      versionId: material.versionId,
      changeId: await Material.max('changeId', {
          where : {
            materialId: material.materialId,
            versionId: material.versionId
          }
        })
    }
    return await author.createMaterial(newMaterial);
  }
  function _toObjectById(id) {
    return await Material.findByPk(id, {
      attributes : [
        materialId, versionId, changeId
      ],
      include : [
        {
          model : Models.User,
          as : 'author',
          attributes : [
            id, name, surname, patronomyc, email, photo
          ]
        }
      ]
    });
  }
  
  return {
    getMaterialById : _getMaterialById,
    getVersions : _getVersions,
    getVersionsById : async (id) => {
      return await _getVersions(await _getMaterialById(id));
    },
    getChanges : _getChanges,
    getChangesById : async (id) => {
      return await _getVersions(await _getMaterialById(id));
    },
    createMaterial : _createMaterial,
    addVersion : _addVersion,
    addVersionById : async (id, author) => {
      return await _addVersion(await _getMaterialById(id), author);
    },
    addChange : _addChange,
    addChangeById : async (id, author) => {
      return await _addChange(await _getMaterialById(id), author);
    },
    toObjectById : _toObjectById
  }
};