const logErrorWrapper = require('@src/utils/proxy_decorators')

module.exports = new Proxy(
  {},
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'USER_DATA_CONTROLLER')
      }
      return target[prop]
    },
  },
)

export {}
