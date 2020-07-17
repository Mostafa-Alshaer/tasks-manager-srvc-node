const express = require('express')
const taskService = require('../services/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res)=> {
    try{
        const task = await taskService.create(req.body, req.user._id)
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res)=> {
    try{
        const tasks = await taskService.getList(req.query, req.user._id)
        res.send(tasks)
    } catch(error){
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res)=> {
    try{
        const task = await taskService.getByID(req.params.id, req.user.id)
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(error){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=> {
    try{
        if(! await taskService.isValidUpdate(req.body) ){
            return res.status(400).send({error: "Invalid updates"})
        }
        const task = await taskService.getByID(req.params.id, req.user.id)
        if (!task){
            return res.status(404).send()
        }
        await taskService.update(task, req.body)
        res.send(task)
    } catch(error){
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=> {
    try{
        const task = await taskService.getByIdAndDelete(req.params.id, req.user.id)
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(error){
        res.status(500).send()
    }
})

module.exports = router