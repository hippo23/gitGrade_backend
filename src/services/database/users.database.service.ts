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
    deleteUserRoles: async ({
      roles,
      personId,
    }: {
      roles: string[]
      personId: number
    }) => {
      await usersDatabaseModel.deleteRoles({ roles, personId })
    },
    addUserRoles: async ({
      roles,
      personId,
    }: {
      roles: string[]
      personId: string
    }) => {
      await usersDatabaseModel.addRoles({ roles, personId })
    },
    createUser: async ({
      firstname,
      lastname,
      middlename,
      location,
      birthday,
      authId,
    }: {
      firstname: string
      lastname: string
      middlename: string
      location: string
      birthday: string
      authId: string
    }) => {
      const { personid } = usersDatabaseModel.insertUser({
        firstname,
        lastname,
        middlename,
        location,
        birthday,
        authId,
      })

      return personid
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
