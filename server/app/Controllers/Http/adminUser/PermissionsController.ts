// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import Permission from 'App/Models/adminUser/Permission'

export default class PermissionsController extends BaseController {
  constructor() {
    super(Permission, {}, {}, 'RolePolicy')
  }
}
