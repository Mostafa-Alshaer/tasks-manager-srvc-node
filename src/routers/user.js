const express = require('express')
const userService = require('../services/user')
const userAvatarService = require('../services/userAvatar')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

router.post('/users', async (req, res)=> {
    try {
        const user = await userService.create(req.body)
        const token = await userService.generateAuthToken(user)
        res.status(201).send({user, token})
    } catch (error){
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res)=> {
    try{
        const user = await userService.getByCredentials(req.body.email, req.body.password)
        const token = await userService.generateAuthToken(user)
        res.send({ user, token})
    } catch(error){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=> {
    try{
        await userService.logout(req.user, req.token)
        res.send()
    } catch(error){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res)=> {
    try{
        await userService.logoutAll(req.user)
        res.send()
    } catch(error){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res)=> {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res)=> {
    try{
        if(! await userService.isValidUpdate(req.body) ){
            return res.status(400).send({error: "Invalid updates"})
        }
        await userService.update(req.user, req.body)
        res.send(req.user)
    } catch(error){
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async (req, res)=> {
    try{
        await userService.delete(req.user)
        res.send(req.user)
    } catch(error){
        res.status(500).send(error)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req , file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('plz upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=> {
    await userAvatarService.upload(req.user, req.file)
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=> {
    await userAvatarService.delete(req.user)
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const avatar = await userAvatarService.get(req.params.id)
        if(!avatar){
            res.status(404).send()
        }
        res.set('Content-Type', 'image/png')
        res.send(avatar)
    } catch(error){
        res.status(500).send()
    }
})

module.exports = router