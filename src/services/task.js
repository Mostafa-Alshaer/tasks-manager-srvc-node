const Task = require('../models/task')

const createTask = async (body, userID) => {
    const task = new Task({
        body,
        owner: userID
    })
    task.save()
    return task;
}
  
module.exports = createTask;