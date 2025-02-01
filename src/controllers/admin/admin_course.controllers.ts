import { Request, Response } from 'express'
const course_service = require('./../../services/database/course.database.service')
const winston = require('winston')

const logger = winston.loggers.get('defaultLogger')

module.exports = {
  createCourseController: async (req, res) => {
    try {
      await course_service.createCourse(req.body)
      res.send('Request succesful!')
    } catch (err) {
      logger.error("CONTROLLER: Can't create the course.")
      throw err
    }
  },
  deleteCourseController: async (req: Request, res: Response) => {},
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
    try {
      logger.info(req.body.updates)
      if (req.body.is_bulk) {
        await course_service.updateCourseBulk({ updates: req.body.updates })
      }
      res.send('Succesfully updated course!')
    } catch (err) {
      logger.error("CONTROLLER: Can't updated courses.")
      throw err
    }
  },
  retrieveCourseController: async (req: Request, res) => {
    try {
      const courses = await course_service.getCourses()
      res.json(courses)
    } catch (err) {
      logger.error("CONTROLLER: Can't get courses.")
      throw err
    }
  },
  retrieveTeachersController: async (req: Request, res: Response) => {},
  updateTeachersController: async (req: Request, res: Response) => {},
  deleteTeachersController: async (req: Request, res: Response) => {},
  retrieveStudentsController: async (req: Request, res: Response) => {},
  updateStudentsController: async (req: Request, res: Response) => {},
  deleteStudentsController: async (req: Request, res: Response) => {},
  deployStudentGradesController: async (req: Request, res: Response) => {},
}

export {}
