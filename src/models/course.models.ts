import format from 'pg-format'
import { stcf_db } from './../config/database.config'
const winston = require('winston')

const logger = winston.loggers.get('defaultLogger')

module.exports = {
  selectStudentsOfSection: async ({
    courseSectionId,
  }: {
    courseSectionId: string
  }) => {
    try {
      const query = format(
        `
        SELECT
          person.personid, studentcoursesection.studentcoursesectionid, pendingstudentcoursesection.pendingstudentcoursesectionid, firstname, lastname, middlename, studentcoursesection.grade AS visiblegrade, pendingstudentcoursesection.grade AS grade, grade_status AS gradestatus, remarks
        FROM studentcoursesection
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
    } catch (err) {
      logger.error(
        'MODE: Error was encountered while selecting students of sectoin.',
      )
      throw err
    }
  },
  selectAllCourseSection: async ({
    courseId,
  }: {
    courseId: number | string
  }) => {
    try {
      const query = format(
        `
        SELECT
            coursesection.coursesectionid,
            coursesection.name,
            JSON_AGG(JSON_BUILD_OBJECT(
                        'personId', organizationpersonrole.organizationpersonroleid,
                        'firstname', person.firstname,
                        'lastname', person.lastname
                     )) AS teachers
        FROM organizationpersonrole
        JOIN facultysectionassignment ON organizationpersonrole.organizationpersonroleid = facultysectionassignment.organizationpersonroleid
        JOIN person ON organizationpersonrole.personid = person.personid
        JOIN coursesection ON facultysectionassignment.coursesectionid = coursesection.coursesectionid
        JOIN course ON coursesection.courseid = course.courseid
        JOIN organizationcalendarsemester on coursesection.organizationcalendarsemesterid = organizationcalendarsemester.organizationcalendarsemesterid
        JOIN organizationcalendar on organizationcalendarsemester.organizationcalendarid = organizationcalendar.organizationcalendarid
        WHERE
            course.courseid = %L
        GROUP BY coursesection.coursesectionid, coursesection.name
      `,
        courseId,
      )

      const res = await stcf_db.query(query)

      return res.rows
    } catch (err) {
      logger.error(
        'MODEl: Error was encountered while getting sections of course.',
      )
      throw err
    }
  },
  selectAllCourse: async () => {
    try {
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
    } catch (err) {
      logger.error('MODEL: An error was encountered while getting all courses.')
      throw err
    }
  },
  mergeStudentGrades: async ({
    courseSectionId,
  }: {
    courseSectionId: number | string
  }) => {
    try {
      const query = format(
        `
        MERGE INTO studentcoursesection AS target
        USING pendingstudentcoursesection AS source
        ON source.studentcoursesectionid = target.studentcoursesectionid
        WHEN MATCHED AND source.grade_status = 'approved' AND coursesectionid = %L THEN
            UPDATE SET target.grade = source.grade
        WHEN NOT MATCHED THEN
            DO NOTHING
        `,
        courseSectionId,
      )

      await stcf_db.query(query)
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while merging student grades.',
      )
      throw err
    }
  },
  setTeachersOfSection: async ({
    teacherIds,
    courseSectionId,
  }: {
    teacherIds: number[] | string[]
    courseSectionId: number | string
  }) => {
    try {
      const query = format(
        `
        INSERT INTO facultysectionassignment
        SELECT teacherid, %L
        FROM UNNEST(
        %L
        ) AS teacherid;
        `,
        courseSectionId,
        teacherIds,
      )

      await stcf_db.query(query)
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while assigning teachers to a section.',
      )
      throw err
    }
  },
  deleteTeachersOfSection: async ({
    teacherIds,
    courseSectionId,
  }: {
    teacherIds: number[] | string[]
    courseSectionId: number | string
  }) => {
    try {
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
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while deleting the teachers of a section.',
      )
      throw err
    }
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
    try {
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
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while updating the details of a course.',
      )
      throw err
    }
  },
  deleteCourse: async ({ courseId }: { courseId: number }) => {
    try {
      const query = format(
        `
        DELETE FROM course
        WHERE courseid = %L
        `,
        courseId,
      )

      await stcf_db.query(query)
    } catch (err) {
      logger.error('MODEL: An error was encountered while deleting a course.')
      throw err
    }
  },
  selectSemesters: async () => {
    try {
      const query = format(`
      SELECT
      JSON_BUILD_OBJECT(
        organizationcalendar.organizationcalendarid, JSON_AGG(JSON_BUILD_OBJECT(
                'semester_id', organizationcalendarsemesterid,
                'semester_type', organizationcalendarsemester.semester
              )
            )
        )
        FROM organizationcalendarsemester
        RIGHT JOIN organizationcalendar on organizationcalendarsemester.organizationcalendarid = organizationcalendar.organizationcalendarid
        GROUP BY organizationcalendar.organizationcalendarid;

      `)

      const res = await stcf_db.query(query)

      return res.rows
    } catch (err) {
      logger.error('MODEL: An error was encountered while selecting semesters.')
      throw err
    }
  },
  selectCalendarYears: async () => {
    try {
      const query = format(
        `
        SELECT organizationcalendarid, academic_year FROM organizationcalendar;
        `,
      )

      const res = await stcf_db.query(query)

      return res.rows
    } catch (err) {
      logger.error(
        'MODE: An error was encountered while selecting all the calendar sessions.',
      )
      throw err
    }
  },
  setSection: async ({
    courseSectionId,
    maximumCapacity,
    semesterId,
  }: {
    courseSectionId: number | string
    maximumCapacity: number
    semesterId: number | string
  }) => {
    try {
      const query = format(
        `
        UPDATE coursesection
        SET
          maximumcapacity = %L,
          organizationcalendarsemesterid = %L
        WHERE coursesectionid = %L;
      `,
        courseSectionId,
        maximumCapacity,
        semesterId,
      )

      await stcf_db.query(query)
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while updating the details of a section',
      )
      throw err
    }
  },
  deleteStudentsOfSection: async ({
    courseSectionId,
    studentIds,
  }: {
    courseSectionId: number | string
    studentIds: number[] | string
  }) => {
    try {
      const query = format(
        `
        DELETE FROM studentcoursesection
        USING person, organizationpersonrole
        WHERE studentcoursesection.organizationpersonroleid = organizationpersonrole.organizationpersonroleid
        AND person.personid = organizationpersonrole.personid
        AND personid = ANY(%L)
        AND studentcoursesectionid = %L;
      `,
        studentIds,
        courseSectionId,
      )

      await stcf_db.query(query)
    } catch (err) {
      logger.error(
        'MODEL: An error was encountered while deleting the students of a section.',
      )
      throw err
    }
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
    try {
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
    } catch (err) {
      logger.error('MODEL: Error in inserting course into table.')
      throw err
    }
  },
}
