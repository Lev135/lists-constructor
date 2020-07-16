const getTaskInfoFromBody = body => ({
    statement: body.statement,
    answer: body.answer,
    solution: body.solution,
    grade: body.grade
});

module.exports = (Models, passport) => {
    return{
        viewPage: (req, res) => {
            Models.materials.Task.findByPk(req.query.id).then(task => {
                res.render('task/view.pug', {task: task, user: req.user});
            }).catch(err => {
                console.error(err);
                res.send(`Ошибка при обработке запроса на отображение задачи: ${err.message}`);
            });
        },
        createPage: (req, res) => {
            if(!req.user.isEditor && !req.user.isAdmin && !req.user.isTeacher){
                res.render('task/no-access.pug');
            }
            else{
                res.render('task/create.pug');
            }
        },
        create: (req, res) => {
            const taskInfo = getTaskInfoFromBody(req.body);
            Models.materials.Task.create(taskInfo).then(task => {
                res.redirect(`./view?id=${task.id}`);
            }).catch(err => {
                console.error(err);
                res.send(`Ошибка при создании новой задачи: ${err}`);
            });
        },
        editPage: (req, res) => {
            if(!req.user.isEditor && !req.user.isAdmin){
                res.render('task/no-access.pug');
            }
            else{
                Models.materials.Task.findByPk(req.query.id).then(task => {
                    res.render('task/edit.pug', {task: task});
                }).catch(err => {
                    res.send(`Ошибка при рендеринге страницы редактирования задачи: ${err}`);
                    console.error(err);
                });
            }
        },
        edit: (req, res) => {
            const updatedTask = getTaskInfoFromBody(req.body);
            updatedTask.id = req.query.id;
            Models.materials.Task.update({
                statement: updatedTask.statement,
                answer: updatedTask.answer,
                solution: updatedTask.solution,
                grade: updatedTask.graed
            }, {where: {id: req.query.id}}).then( result => {
                    res.redirect(`./view?id=${req.query.id}`);
                }
            ).catch(err => {
                console.error(err);
                res.send(`Ошибка при обновлении задачи: ${err}`);
            });
        }
    };
};
