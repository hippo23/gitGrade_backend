const logErrorWrapper = require('@src/utils/proxy_decorators')
const usersDatabaseModel = require('@src/models/users.models')

module.exports = new Proxy(
  {
    getPeople: async ({ filterBy }: { filterBy: string | null }) => {
      const people = await usersDatabaseModel.selectPeople({
        filterBy: filterBy,
      })

      return people
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'SERVICE_USERS_DATABASE')
      }
      return target[prop]
    },
  },
)
