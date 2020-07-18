const express = require('express')
const taskService = require('../services/task')
const auth = require('../middleware/auth')
const loggerFactory = require('../utils/loggerFactory')
const router = new express.Router()
const logger = loggerFactory.getLogger('routers/user')

router.post('/tasks', auth, async (req, res)=> {
    try{
        logger.info('creating a new task...')
        const task = await taskService.create(req.body, req.user._id)
        res.status(201).send(task)
    } catch(error){
        logger.error('error while creating a new task, the error: ' + error)
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res)=> {
    try{
        logger.info('getting a list of tasks...')
        const tasks = await taskService.getList(req.query, req.user._id)
        res.send(tasks)
    } catch(error){
        logger.error('error while getting a list of tasks, the error: ' + error)
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res)=> {
    try{
        logger.info('getting a task by its id...')
        const task = await taskService.getByID(req.params.id, req.user.id)
        if (!task){
            logger.debug('not found a task with an id equal to: ' + req.params.id)
            return res.status(404).send()
        }
        res.send(task)
    } catch(error){
        logger.error('error while getting a task by its id, the error: ' + error)
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=> {
    try{
        logger.info('updating a task info...')
        if(! await taskService.isValidUpdate(req.body) ){
            logger.warn('a user tried to do an invalid update')
            return res.status(400).send({error: "Invalid updates"})
        }
        const task = await taskService.getByID(req.params.id, req.user.id)
        if (!task){
            logger.debug('not found a task with an id equal to: ' + req.params.id)
            return res.status(404).send()
        }
        await taskService.update(task, req.body)
        res.send(task)
    } catch(error){
        logger.error('error while updating a task, the error: ' + error)
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=> {
    try{
        logger.info('deleting a task...')
        const task = await taskService.getByIdAndDelete(req.params.id, req.user.id)
        if (!task){
            logger.debug('not found a task with an id equal to: ' + req.params.id)
            return res.status(404).send()
        }
        res.send(task)
    } catch(error){
        logger.error('error while deleting a task, the error: ' + error)
        res.status(500).send()
    }
})

module.exports = router