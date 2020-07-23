module.exports = (Models) => {
    const fs = require('fs');
    return {
        createTask: (req, res) => {
            console.log('BODY CREATE POST', req.body);
            res.send(`<p>Получен на сервере: </p><p>${req.body}</p>`);
        },
        createTaskPage: (req, res) => {
            res.send("CREATING TASK");
 //           res.render('task/create.pug');
        },
        viewTaskPage: (req, res) => {
            task = JSON.parse(
                    fs.readFileSync(`${__dirname}\\..\\..\\test-data\\test-jsons\\task.json`, 'utf-8')
                );
            res.render('task/view.pug', task);
        }
    };
};
