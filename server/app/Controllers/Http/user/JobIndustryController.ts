// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import JobIndustry from 'App/Models/user/JobIndustry'
import BaseController from '../BaseController'

export default class ExampleController extends BaseController {
  constructor() {
    super(JobIndustry, {}, {})
  }
}
