import format from 'pg-format'
import { stcf_db } from './../config/database.config'
const logErrorWrapper = require('./../utils/proxy_decorators')

module.exports = new Proxy(
  {
    selectPeople: async ({ filterBy = null }) => {
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
      console.log(res)
      console.log('OVER HERE: ', filterBy)
      return res.rows
    },
    deleteRoles: async ({
      roles,
      personId,
    }: {
      roles: string[]
      personId: number
    }) => {
      console.log(roles, personId)
      const query = format(
        `
        DELETE FROM organizationpersonrole
        USING role
        WHERE role.roleid = organizationpersonrole.roleid
        AND role.name = ANY(ARRAY[%L]::text[])
        AND organizationpersonrole.personid = %L;
        `,
        roles,
        personId,
      )

      await stcf_db.query(query)
    },
    addRoles: async ({
      roles,
      personId,
    }: {
      roles: string[]
      personId: number
    }) => {
      const query = format(
        `
        INSERT INTO organizationpersonrole (entrydate, roleid, personid)
        SELECT now(), role.roleid, %L
        FROM role
        WHERE role.name = ANY(ARRAY[%L]::text[])
        ON CONFLICT DO NOTHING;
        `,
        personId,
        roles,
      )

      await stcf_db.query(query)
    },
    insertUser: async ({
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
      const query = format(
        `INSERT INTO person 
          (firstname, lastname, middlename, location, birthday, authid)
        VALUES
          (%L, %L, %L, %L, %L::timestamp, %L)
        RETURNING personid`,
        firstname,
        lastname,
        middlename,
        location,
        birthday,
        authId,
      )

      const res = await stcf_db.query(query)

      return res.rows[0]
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

export {}
