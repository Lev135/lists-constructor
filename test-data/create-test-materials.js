const util = require('util');

module.exports = async (Models) => {
    const MaterialService = require('../modules/services/material-service')(Models);

    const users = await Models.User.findAll();
    const materials = [];
    for (const user of users) {
        materials.push(await MaterialService.createMaterial(user.id,
            `Материал от пользователя №${user.id}`));
    }
    materials.push(await MaterialService.addChange(1, 1, 2, 
        "Прекрасная фича от 2 пользователя"));
    materials.push(await MaterialService.addVersion(1, 1,
        "Добавлена прекрасная фича от 2 пользователя (#1.1.1)"));
    materials.push(await MaterialService.addChange(1, 2, 2,
        "Новая прекрасная фича от 2 пользователя"));
 //   console.log('MATERIALS: ', materials);
    console.log('VERSIONS: ', await MaterialService.getVersions(1));
    console.log('CHANGES', await MaterialService.getChanges(1, 1), '\n', 
                           await MaterialService.getChanges(1, 2));
    console.log('VERSION TREE:' , 
        util.inspect(await MaterialService.getVersionTree(1),
                {compact: false, depth: null, colors: true}));

    
    /// ACCESS RULES
    console.log('ACCESS RULES TESTING....');

    await MaterialService.setAccessRules(1, {
        roles: [],
        users: [
            { userId: 1, typeId: 3 }
        ]
    });
    
    for (user of users) {
        console.log(`USER #${user.id}, ACCESS TO MATERIAL 1 #${
            await MaterialService.getUseraccessTypeId(1, user.id)}`);
    }
    console.log('ACCESS RULES OBJECT', 
        util.inspect(await MaterialService.getAccessRules(1), 
                {compact: false, depth: null, colors: true}));
    
    console.log('UPDATING RULES...');
    await MaterialService.addAccessRules(1, {
        roles: [
            { roleId: 1, typeId: 1 },
            { roleId: 2, typeId: 2 }
        ],
        users: [
            { userId: 1, typeId: 3 },
            { userId: 2, typeId: 1 },
            { userId: 3, typeId: 1 },
            { userId: 4, typeId: 1 }
        ]
    });
    for (user of users) {
        console.log(`USER #${user.id}, NEW ACCESS TO MATERIAL 1 #${
            await MaterialService.getUseraccessTypeId(1, user.id)}`);
    }
    console.log('NEW ACCESS RULES OBJECT', 
        util.inspect(await MaterialService.getAccessRules(1), 
                {compact: false, depth: null, colors: true}));
}