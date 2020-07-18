const express = require('express')
const userService = require('../services/user')
const userAvatarService = require('../services/userAvatar')
const auth = require('../middleware/auth')
const multer = require('multer')
const loggerFactory = require('../utils/loggerFactory')
const router = new express.Router()
const logger = loggerFactory.getLogger('routers/user')

router.post('/users', async (req, res)=> {
    try {
        logger.info('creating a new user...')
        const user = await userService.create(req.body)
        const token = await userService.generateAuthToken(user)
        res.status(201).send({user, token})
    } catch (error){
        logger.error('error while creating a new user, the error: ' + error)
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res)=> {
    try{
        logger.debug('logging in a user, user email is: ' + req.body.email)
        const user = await userService.getByCredentials(req.body.email, req.body.password)
        const token = await userService.generateAuthToken(user)
        res.send({ user, token})
    } catch(error){
        logger.error('error while logging in a user, the error: ' + error)
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=> {
    try{
        logger.debug('logging out a user, user email is: ' + req.user.email)
        await userService.logout(req.user, req.token)
        res.send()
    } catch(error){
        logger.error('error while logging out a user, the error: ' + error)
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res)=> {
    try{
        logger.debug('logging out a user from all places, user email is: ' + req.user.email)
        await userService.logoutAll(req.user)
        res.send()
    } catch(error){
        logger.error('error while logging out a user from all places, the error: ' + error)
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res)=> {
    logger.info('getting a user profile...')
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res)=> {
    try{
        logger.info('updating a user info...')
        if(! await userService.isValidUpdate(req.body) ){
            logger.warn('a user tried to do an invalid update')
            return res.status(400).send({error: "Invalid updates"})
        }
        await userService.update(req.user, req.body)
        res.send(req.user)
    } catch(error){
        logger.error('error while updating a user info, the error: ' + error)
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async (req, res)=> {
    try{
        logger.info('deleting a user...')
        await userService.delete(req.user)
        res.send(req.user)
    } catch(error){
        logger.error('error while deleting a user, the error: ' + error)
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
    logger.info('uploading a user avatar...')
    await userAvatarService.upload(req.user, req.file)
    res.send()
}, (error, req, res, next) => {
    logger.error('error while uploading a user avatar, the error: ' + error)
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=> {
    try {
        logger.info('deleting a user avatar...')
        await userAvatarService.delete(req.user)
        res.send()
    } catch (error) {
        logger.error('error while deleting a user avatar, the error: ' + error)
        res.status(500).send()
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        logger.info('getting a user avatar...')
        const avatar = await userAvatarService.get(req.params.id)
        if(!avatar){
            logger.debug('not found avatar for the user with the id equal to ' + req.params.id)
            res.status(404).send()
        }
        res.set('Content-Type', 'image/png')
        res.send(avatar)
    } catch(error){
        logger.error('error while getting a user avatar, the error: ' + error)
        res.status(500).send()
    }
})

module.exports = router