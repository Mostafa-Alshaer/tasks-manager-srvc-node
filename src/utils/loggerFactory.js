const winston = require('winston')

const loggerFactory = {
    getLogger: (file) => {
        const logger = winston.createLogger({
            level: 'debug',
            format: winston.format.json(),
            defaultMeta: { file: file, time: new Date() },
            transports: [
              new winston.transports.File({ 
                  filename: process.env.LOGS_FOLDER + 'error.log',
                   level: 'error' 
                }),
              new winston.transports.File({ 
                  filename: process.env.LOGS_FOLDER + 'combined.log' 
                }),
            ],
        })
        return logger
    }
}

module.exports = loggerFactory