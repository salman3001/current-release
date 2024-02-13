// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import JobDepartment from 'App/Models/user/JobDepartment'

export default class JobIndustryController extends BaseController {
  constructor() {
    super(JobDepartment, {}, {})
  }
}
