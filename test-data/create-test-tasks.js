const tasks = [
    {
        statement: 'Statement num. 1',
        answer: 'Answer num. 1', 
        solution: 'Solution num. 1', 
        grade: 1
    },
    {
        statement: 'Statement num. 2',
        answer: 'Answer num. 2', 
        solution: 'Solution num. 2', 
        grade: 2
    },
    {
        statement: 'Statement num. 3',
        answer: 'Answer num. 3', 
        solution: 'Solution num. 3', 
        grade: 3
    }
];

module.exports = (Models) => {
    for (const task of tasks) {
      Models.materials.Task.create(task);
    }
};