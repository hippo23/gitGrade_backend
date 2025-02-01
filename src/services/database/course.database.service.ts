const course_models = require('./../../models/course.models')
const winston = require('winston')

const logger = winston.loggers.get('defaultLogger')

module.exports = {
  getStudentsOfSection: async ({
    sectionId,
  }: {
    sectionId: number | string
  }) => {
    try {
      const students = await course_models.selectStudentsOfSection({
        sectionId: sectionId,
      })
      return students
    } catch (err) {
      logger.error('SERVICE: Error in getting students of section.')
      throw err
    }
  },
  getCourseSections: async ({ courseId }: { courseId: number | string }) => {
    try {
      const sections = await course_models.selectAllCourseSection({
        courseId: courseId,
      })
      return sections
    } catch (err) {
      logger.error('SERVICE: Error in retrieving sections of the course.')
      throw err
    }
  },
  getCourses: async () => {
    try {
      const courses = await course_models.selectAllCourse()
      return courses
    } catch (err) {
      logger.error('SERVICE: Error in retrieving courses.')
      throw err
    }
  },
  createCourse: async ({
    name,
    units,
    description,
  }: {
    name: string
    units: number
    description: string
  }) => {
    try {
      await course_models.insertCourse({
        name: name,
        units: units,
        description: description,
      })
    } catch (err) {
      logger.error('SERVICE: Error in creating course.')
      throw err
    }
  },
  deployStudentGrades: async ({
    courseSectionId,
  }: {
    courseSectionId: number | string
  }) => {
    try {
      await course_models.mergeStudentGrades({
        courseSectionId: courseSectionId,
      })
    } catch (err) {
      logger.error('SERVICE: Error in deploying student grades.')
      throw err
    }
  },
  updateTeachersOfSection: async ({
    courseSectionId,
    teacherIds,
  }: {
    courseSectionId: number | string
    teacherIds: number[] | string
  }) => {
    try {
      await course_models.deleteTeachersOfSection({
        courseSectionId: courseSectionId,
        teacherIds: null,
      })
      await course_models.setTeachersOfSection({
        courseSectionId: courseSectionId,
        teacherIds: teacherIds,
      })
    } catch (err) {
      logger.error('SERVICE: Error in updating teachers of the section.')
      throw err
    }
  },
  updateCourseBulk: async ({
    updates,
  }: {
    updates: {
      courseId: number
      description: string
      units: number
      name: string
    }[]
  }) => {
    try {
      await course_models.setCourseBulk({
        updates: updates,
      })
    } catch (err) {
      logger.error('SERVICE: Error in updating the course details.')
      throw err
    }
  },
  deleteCourse: async ({ courseId }: { courseId: number | string }) => {
    try {
      await course_models.deleteCourse({ courseId: courseId })
    } catch (err) {
      logger.error('SERVICE: Error in deleting the course.')
      throw err
    }
  },
  getCalendarSemesters: async () => {
    try {
      const semesters = await course_models.selectSemesters()
      return semesters
    } catch (err) {
      logger.error('SERVICE: Error in retrieving semesters.')
      throw err
    }
  },
  getCalendarSessions: async () => {
    try {
      const sessions = await course_models.selectCalendarYears()
      return sessions
    } catch (err) {
      logger.error('SERVICE: Error in retrieving calendar sessions.')
      throw err
    }
  },
  updateSectionDetails: async ({
    courseSectionId,
    maximumCapacity,
    semesterId,
  }: {
    courseSectionId: number | string
    maximumCapacity: number
    semesterId: number | string
  }) => {
    try {
      await course_models.setSection({
        courseSectionId: courseSectionId,
        maximumCapacity: maximumCapacity,
        semesterId: semesterId,
      })
    } catch (err) {
      logger.error('SERVICE: Error in updating section details.')
      throw err
    }
  },
  updateStudentsOfSection: async ({
    deletedStudentIds,
    addedStudentIds,
    courseSectionId,
  }: {
    deletedStudentIds: number[] | string[]
    addedStudentIds: number[] | string[]
    courseSectionId: number | string
  }) => {
    try {
      await course_models.deleteStudentsOfSection({
        courseSectionId: courseSectionId,
        studentIds: deletedStudentIds,
      })
      await course_models.insertStudentsOfSection({
        courseSectionId: courseSectionId,
        studentIds: addedStudentIds,
      })
    } catch (err) {
      logger.error('SERVICE: Error in updating the students of a section.')
      throw err
    }
  },
}

export {}
