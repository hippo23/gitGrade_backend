const axios = require('axios').default
const logErrorWrapper = require('@src/utils/proxy_decorators')
const tokenUtils = require('@src/utils/tokens')
const { roleCodes } = require('@src/utils/constants')

module.exports = new Proxy(
  {
    getUserAccounts: async ({
      queryParameters = '',
    }: {
      queryParameters: string
    }) => {
      const managementToken = await tokenUtils.getAuthManagementToken()
      const { data } = await axios.get(
        'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users',
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
          },
          params: { q: queryParameters, search_engine: 'v3' },
        },
      )

      const users = data.map((user) => {
        return {
          personid: user.app_metadata?.personId,
          approved: user.app_metadata?.approved,
          email: user.email,
          email_verified: user.email_verified,
          name: user.name,
          user_id: user.user_id,
          picture: user.picture,
        }
      })

      return users
    },
    setUserAccounts: async ({ userId, data }) => {
      const managementToken = await tokenUtils.getAuthManagementToken()

      await axios.patch(
        `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
            'content-type': 'application/json',
          },
        },
      )
    },
    getUserRoles: async ({ userId }) => {
      const managementToken = await tokenUtils.getAuthManagementToken()
      const { data } = await axios.get(
        `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${userId}/roles`,
        {
          headers: {
            Authorization: `Bearer ${managementToken}`,
            Accept: 'application/json',
          },
        },
      )

      return data
    },
    enableUserRoles: async ({ userId, roles = [] }) => {
      const managementToken = await tokenUtils.getAuthManagementToken()
      const translatedRoles = roles.map((role) => roleCodes[role])
      if (translatedRoles.length > 0) {
        await axios.post(
          `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${userId}/roles`,
          {
            roles: translatedRoles,
          },
          {
            headers: {
              Authorization: `Bearer ${managementToken}`,
            },
          },
        )
      }
    },
    disableUserRoles: async ({ userId, roles = [] }) => {
      const managementToken = await tokenUtils.getAuthManagementToken()
      const translatedRoles = roles.map((role) => roleCodes[role])
      if (translatedRoles.length > 0) {
        await axios.delete(
          `https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${managementToken}`,
            },
            data: { roles: translatedRoles },
          },
        )
      }
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'AUTH_USER_SERVICE')
      }
      return target[prop]
    },
  },
)

export {}
