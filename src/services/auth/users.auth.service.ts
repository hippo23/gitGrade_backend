const axios = require('axios').default
const logErrorWrapper = require('@src/utils/proxy_decorators')
const tokenUtils = require('@src/utils/tokens')

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
          params: { q: '', search_engine: 'v3' },
        },
      )

      const users = data.map((user) => {
        return {
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
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'COURSE_SERVICE')
      }
      return target[prop]
    },
  },
)

export {}
