module.exports = async (Models) => {
    const MaterialService = require('../modules/services/material-service')(Models);

    const users = await Models.User.findAll();
    const materials = [];
    for (const user of users) {
        materials.push(await MaterialService.createMaterial(user,
            `Материал от пользователя №${user.id}`));
    }
    materials.push(await MaterialService.addChange(1, 1, users[1], 
        "Прекрасная фича от 2 пользователя"));
    materials.push(await MaterialService.addVersion(1, users[0],
        "Добавлена прекрасная фича от 2 пользователя (#1.1.1)"));
    materials.push(await MaterialService.addChange(1, 2, users[1],
        "Новая прекрасная фича от 2 пользователя"));
 //   console.log('MATERIALS: ', materials);
    console.log('VERSIONS: ', await MaterialService.getVersions(1));
    console.log('CHANGES', await MaterialService.getChanges(1, 1), '\n', 
                           await MaterialService.getChanges(1, 2));
    console.log('VERSION TREE:' , 
        JSON.stringify(await MaterialService.getVersionTree(1), null, 2));

    /// ACCESS RULES

}