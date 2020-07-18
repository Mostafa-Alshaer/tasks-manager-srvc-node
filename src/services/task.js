const Task = require('../models/task')

const taskService = {
    create: async (body, userID) => {
        const task = new Task({
            ...body,
            owner: userID
        })
        return await task.save()
    },
    getList: async (query, userID) => {
        const match = {owner: userID }
        const sort = {}
        if(query.completed){
            match.completed = query.completed === 'true'
        }
        if(query.sortBy){
            const parts = query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        return await Task.find(match)
        .limit(parseInt(query.limit))
        .skip(parseInt(query.skip))
        .sort(sort)
    },
    getByID: async (id, userID) => {
        return await Task.findOne({ _id: id , owner: userID})
    },
    isValidUpdate: async (body) => {
        const updates = Object.keys(body)
        const allowedUpdates = ['description','completed']
        return updates.every((update) => allowedUpdates.includes(update))
    },
    update: async (task, body) => {
        const updates = Object.keys(body)
        updates.forEach((update) => task[update] = body[update])
        await task.save()
    },
    getByIdAndDelete: async (id, userID) => {
        return await Task.findOneAndDelete({ _id: id, owner: userID})
    }
}
  
module.exports = taskService;