const axios = require('axios').default
const logErrorWrapper = require('@src/utils/proxy_decorators')

module.exports = new Proxy(
  {
    getAuthManagementToken: async () => {
      const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'elArxXf2Id1DacHIuIe2LDtTFkSssNNd',
        client_secret: process.env.M2M_MANAGEMENT_API_SECRET as string,
        audience: 'https://dev-uslaj1b5ati50067.us.auth0.com/api/v2/',
      })

      const token = await axios.post(
        'https://dev-uslaj1b5ati50067.us.auth0.com/oauth/token',
        data,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      )

      return token.data.access_token
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'TOKEN_UTILS')
      }
      return target[prop]
    },
  },
)

export {}
