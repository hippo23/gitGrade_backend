const general_models = require('./../../models/general.models')
const logErrorWrapper = require('@src/utils/proxy_decorators')

module.exports = new Proxy(
  {
    getCalendarSessions: async () => {
      const calendarSessions = await general_models.selectCalendarSessions()
      return calendarSessions
    },
    getSemesters: async () => {
      const semesters = await general_models.selectSemesters()
      return semesters
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'GENERAL DATABASE SERVICE')
      }
      return target[prop]
    },
  },
)

export {}
