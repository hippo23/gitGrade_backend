import format from 'pg-format'
import { stcf_db } from './../config/database.config'
const logErrorWrapper = require('./../utils/proxy_decorators')

module.exports = new Proxy(
  {
    selectCalendarSessions: async () => {
      const query = format(
        `
      SELECT organizationcalendarid, academic_year FROM organizationcalendar;
      `,
      )

      const res = await stcf_db.query(query)
      return res.rows
    },
    selectSemesters: async () => {
      const query = format(
        `
        SELECT
            organizationcalendar.organizationcalendarid,
                        JSON_AGG(JSON_BUILD_OBJECT(
                                'semester_id', organizationcalendarsemesterid,
                                'semester_type', organizationcalendarsemester.semester
                              )
                        ) FILTER (WHERE organizationcalendarsemester.organizationcalendarsemesterid IS NOT NULL) AS semesters
        FROM organizationcalendarsemester
        RIGHT JOIN organizationcalendar on organizationcalendarsemester.organizationcalendarid = organizationcalendar.organizationcalendarid
        GROUP BY organizationcalendar.organizationcalendarid;
        `,
      )

      const res = await stcf_db.query(query)
      return res.rows.reduce((acc, row) => {
        acc[row.organizationcalendarid] =
          row.semesters == null ? [] : row.semesters
        return acc
      }, {})
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'GENERAL MODEL')
      }
      return target[prop]
    },
  },
)
