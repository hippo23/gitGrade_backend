import format from 'pg-format'
import { stcf_db } from './../config/database.config'
const logErrorWrapper = require('./../utils/proxy_decorators')

module.exports = new Proxy(
  {
    selectPeople: async ({ filterBy }) => {
      const query = format(
        `
        SELECT 
            person.personid, organizationpersonrole.organizationpersonroleid, firstname, lastname, middlename FROM person
        JOIN 
                organizationpersonrole ON 
                    person.personid = organizationpersonrole.personid
        JOIN 
                role ON 
                    organizationpersonrole.roleid = role.roleid
        WHERE 
            role.name = %L 
           OR %L IS NULL;
      `,
        filterBy,
        filterBy,
      )

      const res = await stcf_db.query(query)
      return res.rows
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'MODELS_USERS_DATABASE')
      }
      return target[prop]
    },
  },
)
