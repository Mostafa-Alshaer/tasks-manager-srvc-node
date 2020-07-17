const User = require('../models/user')

const userService = {
    create: async (body) => {
        const user = new User(body)
        return await user.save()
    },
    generateAuthToken: async (user) => {
        return await user.generateAuthToken()
    },
    getByCredentials: async (email, password) => {
        return await User.findByCredentials(email, password)
    },
    logout: async (user, reqToken) => {
        user.tokens = user.tokens.filter((token) => {
            return token.token !== reqToken
        })
        await user.save()
    },
    logoutAll: async (user) => {
        user.tokens = []
        await user.save()
    },
    isValidUpdate: async (body) => {
        const updates = Object.keys(body)
        const allowedUpdates = ['name','email','password','age']
        return updates.every((update) => allowedUpdates.includes(update))
    },
    update: async (user, body) => {
        const updates = Object.keys(body)
        updates.forEach((update) => user[update] = body[update])
        await user.save()
    },
    delete: async (user) => {
        await user.remove()
    }
}

module.exports = userService