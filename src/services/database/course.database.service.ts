const course_models = require('./../../models/course.models')
const logErrorWrapper = require('@src/utils/proxy_decorators')

module.exports = new Proxy(
  {
    getStudentsOfSection: async ({
      courseSectionId,
    }: {
      courseSectionId: number | string
    }) => {
      const students = await course_models.selectStudentsOfSection({
        courseSectionId: courseSectionId,
      })
      return students
    },
    getCourseSections: async ({ courseId }: { courseId: number | string }) => {
      const sections = await course_models.selectAllCourseSection({
        courseId: courseId,
      })
      return sections
    },
    getCourses: async () => {
      const courses = await course_models.selectAllCourse()
      return courses
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
      await course_models.insertCourse({
        name: name,
        units: units,
        description: description,
      })
    },
    deployStudentGrades: async ({
      courseSectionId,
    }: {
      courseSectionId: number
    }) => {
      await course_models.mergeStudentGrades({
        courseSectionId,
      })
    },
    updateTeachersOfSection: async ({
      courseSectionId,
      teacherIds,
    }: {
      courseSectionId: number | string
      teacherIds: number[] | string[]
    }) => {
      await course_models.deleteTeachersOfSection({
        courseSectionId: courseSectionId,
        teacherIds: null,
      })
      await course_models.setTeachersOfSection({
        courseSectionId: courseSectionId,
        teacherIds: teacherIds,
      })
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
      await course_models.setCourseBulk({
        updates: updates,
      })
    },
    deleteCourse: async ({ courseId }: { courseId: number | string }) => {
      await course_models.deleteCourse({ courseId: courseId })
    },
    updateSectionDetails: async ({
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
      await course_models.setSection({
        courseSectionId: courseSectionId,
        maximumCapacity: maximumCapacity,
        semesterId: semesterId,
        name: name,
      })
    },
    updateStudentsOfSection: async ({
      changedStudents = [],
    }: {
      changedStudents: object[]
    }) => {
      await course_models.setStudentsOfSection({
        changedStudents,
      })
    },
    getSectionsOfCourse: async ({ courseId }: { courseId: number }) => {
      const sections = await course_models.selectSectionsOfCourse({
        courseId,
      })
      return sections
    },
    createSection: async ({
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
      const courseSectionId = await course_models.insertSection({
        courseId,
        name,
        maximumCapacity,
        semesterId,
      })
      return courseSectionId
    },
    deleteStudentsOfSection: async ({
      deletedIds = [],
      courseSectionId = 0,
    }: {
      deletedIds: number[]
      courseSectionId: number
    }) => {
      await course_models.deleteStudentsOfSection({
        studentIds: deletedIds,
        courseSectionId,
      })
    },
    addStudentsToSection: async ({
      studentIds,
      courseSectionId,
    }: {
      studentIds: number[]
      courseSectionId: number
    }) => {
      await course_models.insertStudentsToSection({
        studentIds,
        courseSectionId,
      })
    },
    clearStudentGrades: async ({
      studentIds,
      courseSectionId,
    }: {
      studentIds: number[]
      courseSectionId: number
    }) => {
      await course_models.clearFinalGrades({ studentIds, courseSectionId })
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
