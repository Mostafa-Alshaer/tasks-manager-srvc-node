const User = require('../models/user')
const sharp = require('sharp')

const userAvatarService = {
    upload: async (user, file) => {
        const buffer = await sharp(file.buffer)
        .resize({ width: 250, height: 250}).png().toBuffer()
        user.avatar = buffer
        await user.save()
    },
    delete: async (user) => {
        user.avatar = undefined
        await user.save()
    },
    get: async (userID) => {
        try {
            const user = await User.findById(userID)
            if(!user || !user.avatar){
                return null
            }
            return user.avatar
        } catch (error) {
            return null
        }
    }
}

module.exports = userAvatarService