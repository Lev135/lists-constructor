module.exports = (Models) => {
    const TaskService = require('../services/task-service')(Models);

    return{
        viewPage: async (req, res) => {
            try {
                const id = req.query.id;
                if (!id) {
                    throw {message: "в запросе не указан id задачи"};
                }
                const accessType = await TaskService.getUserAccessTypeId(id, req.user.id);
                console.log('ACCESS:', accessType);
                if (accessType < 2 /* Teacher access */) {
                    return res.render('task/no-access.pug', {id: id});
                }
                taskObj = await TaskService.getTaskObj(id);
                console.log('TASK OBJECT', taskObj);
                return res.render('task/view.pug', taskObj);
            }
            catch (err) {
                console.error(err);
                res.send(`Ошибка при обработке запроса на отображение задачи: ${err.message}`);
            }
        },
        createPage: async (req, res) => {
            res.render('task/create.pug');
        },
        create: async (req, res) => {
            try {
                const task = await TaskService.createTask(req.body, req.user.id);
                res.redirect(`./view?id=${task.id}`);
            }
            catch (err) {
                console.error(err);
                res.send(`Ошибка при создании новой задачи: ${err}`);
            }
        },
        editPage: async (req, res) => {
            try {
                const id = req.query.id;
                if (!id) {
                    throw {message: "в запросе не указан id задачи"};
                }
                const accessType = TaskServices.getUserAccessTypeId(id, req.user.id);
                if (accessType < 2 /* Teacher access */) {
                    res.render('task/no-access.pug', {id: id});
                }
                taskObj = await TaskService.getTaskObj(id);
                res.render('task/edit.pug', taskObj);
            }
            catch (err) {
                console.error(err);
                res.send(`Ошибка при рендеринге страницы редактирования задачи: ${err}`);
            }
        },
        edit: async (req, res) => {
            try {
                const id = req.query.id;
                if (!id) {
                    throw {message: "в запросе не указан id задачи"};
                }
                const accessType = TaskService.getUserAccessTypeId(id, req.user.id);
                if (accessType < 2 /* Teacher access */) {
                    res.render('task/no-access.pug', {id: id});
                }
                taskChange = await TaskService.addChange(req.body, id, req.user.id);
                res.redirect(`./view?id=${taskChange.id}`);
            }
            catch (err) {
                console.error(err);
                res.send(`Ошибка при обновлении задачи: ${err}`);
            }
        }
    };
};
