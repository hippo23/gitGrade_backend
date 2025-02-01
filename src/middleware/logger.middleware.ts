const winston = require('winston')
const morgan = require('morgan')
const { timestamp, printf, colorize, align } = winston.format

winston.loggers.add('defaultLogger', {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'morgan',
  },
  format: winston.format.combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
})

winston.loggers.add('morganLogger', {
  level: 'http',
  defaultMeta: {
    service: 'morgan',
  },
  format: winston.format.combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
})

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
    })
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message: string) => {
        const data = JSON.parse(message)
        winston.loggers.get('morganLogger').http(data)
      },
    },
  },
)

module.exports = { winston, morganMiddleware }
