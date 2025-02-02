const winston = require('winston')

const logger = winston.loggers.get('defaultLogger')

const logErrorWrapper = (fn: Function, fn_name: string, type: string) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (err) {
      logger.error(
        `${type.toUpperCase()}: There has been a problem with ${fn_name.toUpperCase()}.`,
      )
      throw err
    }
  }
}

module.exports = logErrorWrapper

export {}
