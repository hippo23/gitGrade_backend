import { Request, Response } from 'express'
const course_service = require('./../../services/database/course.database.service')
const logErrorWrapper = require('@src/utils/proxy_decorators')

module.exports = new Proxy(
  {
    createCourseController: async (req, res) => {
      await course_service.createCourse(req.body)
      res.send('Request succesful!')
    },
    deleteCourseController: async (
      req: Request<
        {
          courseId: number
        },
        object,
        object
      >,
      res: Response,
    ) => {
      await course_service.deleteCourse(req.params)
      res.send('Course was deleted successfully.')
    },
    updateCourseController: async (
      req: Request<
        object,
        object,
        {
          is_bulk: boolean
          updates: {
            courseId: number
            description: string
            units: number
            name: string
          }
        }
      >,
      res: Response,
    ) => {
      if (req.body.is_bulk) {
        await course_service.updateCourseBulk({ updates: req.body.updates })
      }
      res.send('Succesfully updated course!')
    },
    retrieveCourseController: async (req: Request, res) => {
      const courses = await course_service.getCourses()
      res.json(courses)
    },
    retrieveSectionsController: async (req: Request, res: Response) => {
      const courses = await course_service.getSectionsOfCourse(req.params)
      res.json(courses)
    },
    retrieveTeachersController: async (req: Request, res: Response) => {},
    updateTeachersController: async (req: Request, res: Response) => {
      await course_service.updateTeachersOfSection(req.body)
      res.send('Successfully updated the teachers of the section!')
    },
    updateSectionController: async (req: Request, res: Response) => {
      await course_service.updateSectionDetails(req.body)
      res.send('Successfuly updated the details of the section!')
    },
    createSectionController: async (req: Request, res: Response) => {
      const courseSectionId = await course_service.createSection(req.body)
      await course_service.updateTeachersOfSection({
        courseSectionId: courseSectionId,
        teacherIds: req.body.teacherIds,
      })
      res.send('Successfully created the section!')
    },
    retrieveStudentsController: async (req: Request, res: Response) => {
      const students = await course_service.getStudentsOfSection(req.params)
      res.json(students)
    },
    updateStudentsController: async (req: Request, res: Response) => {
      await course_service.deleteStudentsOfSection(req.body)
      await course_service.updateStudentsOfSection(req.body)
      res.send('Successfully pushed edits to student section!')
    },
    addStudentsController: async (req: Request, res: Response) => {
      await course_service.addStudentsToSection(req.body)
      res.send('Successfully added students to section!')
    },
    handleStudentGradesController: async (req: Request, res: Response) => {
      if (req.query.action == 'deploy') {
        await course_service.deployStudentGrades(req.body)
        res.send('Succesfully uploaded student grades!')
      } else if (req.query.action == 'clear_grade') {
        await course_service.clearStudentGrades(req.body)
        res.send('Succesfully cleared student grades!')
      }
    },
  },
  {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return logErrorWrapper(target[prop], prop, 'ADMIN_COURSE_CONTROLLER')
      }
      return target[prop]
    },
  },
)

export {}
