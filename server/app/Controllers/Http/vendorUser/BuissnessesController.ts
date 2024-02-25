// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Business from 'App/Models/vendorUser/Business'
import BusinesUpdateValidator from 'App/Validators/BusinesUpdateValidator'
import BaseController from '../BaseController'

export default class BuissnessesController extends BaseController {
  constructor() {
    super(Business, {}, BusinesUpdateValidator, 'BussinessPolicy')
  }

  // public async store({}: HttpContextContract) {}

  // public async show({}: HttpContextContract) {}

  // public async update({}: HttpContextContract) {}
}
