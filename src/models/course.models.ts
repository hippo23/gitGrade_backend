import format from 'pg-format'
import { stcf_db } from './../config/database.config'
const logErrorWrapper = require('./../utils/proxy_decorators')

module.exports = new Proxy(
  {
    selectStudentsOfSection: async ({
      courseSectionId,
    }: {
      courseSectionId: string
    }) => {
      const query = format(
        `
        SELECT
            person.personid, organizationpersonrole.organizationpersonroleid, studentcoursesection.studentcoursesectionid,
            pendingstudentcoursesection.pendingstudentcoursesectionid, firstname, lastname, middlename,
            studentcoursesection.grade AS visiblegrade, pendingstudentcoursesection.grade AS grade,
            grade_status AS gradestatus, remarks  FROM studentcoursesection
        JOIN
                organizationpersonrole ON
                    studentcoursesection.organizationpersonroleid = organizationpersonrole.organizationpersonroleid
        JOIN
                person ON
                    organizationpersonrole.personid = person.personid
        JOIN
                pendingstudentcoursesection ON
                    studentcoursesection.studentcoursesectionid = pendingstudentcoursesection.studentcoursesectionid
        WHERE
            coursesectionid = %L;

      `,
        courseSectionId,
      )

      const res = await stcf_db.query(query)

      return res.rows
    },
    selectSectionsOfCourse: async ({
      courseId,
    }: {
      courseId: number | string
    }) => {
      const query = format(
        `
        SELECT
            coursesection.coursesectionid,
            coursesection.name,
            coursesection.maximumcapacity,
            coursesection.organizationcalendarsemesterid AS semesterid,
            organizationcalendar.organizationcalendarid,
            JSON_AGG(JSON_BUILD_OBJECT(
                        'teacherId', organizationpersonrole.organizationpersonroleid,
                        'firstname', person.firstname,
                        'lastname', person.lastname
                     )) AS teachers
        FROM coursesection
        LEFT JOIN facultysectionassignment ON coursesection.coursesectionid = facultysectionassignment.coursesectionid
        LEFT JOIN organizationpersonrole ON facultysectionassignment.organizationpersonroleid = organizationpersonrole.organizationpersonroleid
        LEFT JOIN person ON organizationpersonrole.personid = person.personid
        JOIN course ON coursesection.courseid = course.courseid
        JOIN organizationcalendarsemester on coursesection.organizationcalendarsemesterid = organizationcalendarsemester.organizationcalendarsemesterid
        JOIN organizationcalendar on organizationcalendarsemester.organizationcalendarid = organizationcalendar.organizationcalendarid
        WHERE
            course.courseid = %L
        GROUP BY coursesection.coursesectionid, coursesection.name, coursesection.maximumcapacity, semesterid, organizationcalendar.organizationcalendarid
      `,
        courseId,
      )

      const res = await stcf_db.query(query)
      const final_res = res.rows.map((row) => {
        if (row.teachers[0].teacherId == null) {
          row.teachers = []
        }

        return row
      })

      return final_res
    },
    selectAllCourse: async () => {
      const query = format(
        `
        SELECT
            courseid, name, description, units
        FROM
            course
        ORDER BY
          name ASC
        `,
      )

      const res = await stcf_db.query(query)

      return res.rows
    },
    mergeStudentGrades: async ({
      courseSectionId,
    }: {
      courseSectionId: number
    }) => {
      const query = format(
        `
        MERGE INTO studentcoursesection
        USING pendingstudentcoursesection
        ON studentcoursesection.studentcoursesectionid = pendingstudentcoursesection.studentcoursesectionid
        WHEN MATCHED AND pendingstudentcoursesection.grade_status = 'approved'
        AND studentcoursesection.coursesectionid = %L THEN
            UPDATE SET grade = pendingstudentcoursesection.grade
        WHEN NOT MATCHED THEN
            DO NOTHING;
        `,
        courseSectionId,
      )

      await stcf_db.query(query)
    },
    setTeachersOfSection: async ({
      teacherIds,
      courseSectionId,
    }: {
      teacherIds: number[] | string[]
      courseSectionId: number | string
    }) => {
      const query = format(
        `
        INSERT INTO facultysectionassignment (organizationpersonroleid, coursesectionid)
        SELECT teacherid, %L
        FROM UNNEST(ARRAY[%L]::integer[]) AS teacherid
        ON CONFLICT DO NOTHING;
        `,
        courseSectionId,
        teacherIds,
      )

      await stcf_db.query(query)
    },
    deleteTeachersOfSection: async ({
      teacherIds,
      courseSectionId,
    }: {
      teacherIds: number[] | string[]
      courseSectionId: number | string
    }) => {
      let query = ''
      if (teacherIds == null) {
        query = format(
          `
          DELETE FROM facultysectionassignment
          WHERE coursesectionid = %L
          `,
          courseSectionId,
        )
      } else {
        query = format(
          `
          DELETE FROM facultysectionassignment
          WHERE coursesectionid = %L
          AND organizationpersonroleid = ANY(%L)
          `,
          courseSectionId,
          teacherIds,
        )
      }

      await stcf_db.query(query)
    },
    setCourseBulk: async ({
      updates,
    }: {
      updates: {
        courseSectionid: number
        units: number
        description: string
        name: string
      }[]
    }) => {
      const query = format(
        `
      WITH data AS (
          SELECT %L::jsonb AS data
      )
      UPDATE course
      SET
          name = elem->>'name',
          units = (elem->>'units')::int,
          description = elem->>'description'
      FROM data,
          jsonb_array_elements(data) AS elem
      WHERE course.courseid = (elem->>'courseId')::int
      `,
        [JSON.stringify(updates)],
      )

      await stcf_db.query(query)
    },
    deleteCourse: async ({ courseId }: { courseId: number }) => {
      const query = format(
        `
        DELETE FROM course
        WHERE courseid = %L
        `,
        courseId,
      )

      await stcf_db.query(query)
    },
    setSection: async ({
      courseSectionId,
      maximumCapacity,
      semesterId,
      name,
    }: {
      courseSectionId: number | string
      maximumCapacity: number
      semesterId: number | string
      name: string
    }) => {
      const query = format(
        `
        UPDATE coursesection
        SET
          maximumcapacity = %L,
          organizationcalendarsemesterid = %L,
          name = %L
        WHERE coursesectionid = %L;
      `,
        maximumCapacity,
        semesterId,
        name,
        courseSectionId,
      )

      await stcf_db.query(query)
    },
    deleteStudentsOfSection: async ({
      courseSectionId,
      studentIds,
    }: {
      courseSectionId: number
      studentIds: number[]
    }) => {
      const query = format(
        `
        DELETE FROM studentcoursesection
        USING person, organizationpersonrole
        WHERE studentcoursesection.organizationpersonroleid = organizationpersonrole.organizationpersonroleid
        AND organizationpersonrole.organizationpersonroleid = ANY(ARRAY[%L]::integer[])
        AND studentcoursesection.coursesectionid = %L;
      `,
        studentIds,
        courseSectionId,
      )

      await stcf_db.query(query)
    },
    insertCourse: async ({
      name,
      units,
      description,
    }: {
      name: string
      units: number
      description: string
    }) => {
      const query = format(
        `
      INSERT INTO course (name, units, organizationid, description)
      VALUES
          (%L, %L, 1, %L);
      `,
        name,
        units,
        description,
      )

      await stcf_db.query(query)
    },
    insertSection: async ({
      courseId,
      name,
      maximumCapacity,
      semesterId,
    }: {
      courseId: number
      name: string
      maximumCapacity: number
      semesterId: number
    }) => {
      const query = format(
        `
        INSERT INTO coursesection 
            (maximumcapacity, name, courseid, organizationcalendarsemesterid)
        VALUES
            (%L, %L, %L, %L)
        RETURNING coursesectionid;
        `,
        maximumCapacity,
        name,
        courseId,
        semesterId,
      )

      const res = await stcf_db.query(query)

      return res.rows[0].coursesectionid
    },
    setStudentsOfSection: async ({
      changedStudents,
    }: {
      changedStudents: object[]
    }) => {
      const query = format(
        `
        WITH data AS (
            SELECT %L::jsonb AS data
        )
        UPDATE pendingstudentcoursesection
        SET
            grade_status = (elem->>'gradeStatus')::grade_status,
            remarks = elem->>'remarks',
            grade = (elem->>'grade')::grade_value
        FROM data,
             jsonb_array_elements(data) AS elem
        WHERE studentcoursesectionid = (elem->>'studentCourseSectionId')::integer;
        `,
        [JSON.stringify(changedStudents)],
      )

      await stcf_db.query(query)
    },
    insertStudentsToSection: async ({
      studentIds,
      courseSectionId,
    }: {
      studentIds: number[]
      courseSectionId: number
    }) => {
      const query = format(
        `
        INSERT INTO studentcoursesection (coursesectionid, organizationpersonroleid)
        SELECT %L, studentid
        FROM UNNEST(ARRAY[%L]::integer[]) AS studentid
        ON CONFLICT DO NOTHING;
      `,
        courseSectionId,
        studentIds,
      )

      await stcf_db.query(query)
    },
    clearFinalGrades: async ({
      studentIds,
      courseSectionId,
    }: {
      studentIds: number[]
      courseSectionId: number
    }) => {
      const query = format(
        `
        UPDATE studentcoursesection
        SET grade = NULL
        FROM UNNEST(ARRAY[%L]::integer[]) as studentid
        WHERE studentcoursesection.coursesectionid = %L
        AND studentcoursesection.organizationpersonroleid = studentid;
        `,
        studentIds,
        courseSectionId,
      )

      await stcf_db.query(query)
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'COURSE MODEL')
      }
      return target[prop]
    },
  },
)
