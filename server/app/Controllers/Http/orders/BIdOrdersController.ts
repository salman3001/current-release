// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BidOrder from 'App/Models/orders/BidOrder'
import BaseController from '../BaseController'

export default class BIdOrdersController extends BaseController {
  constructor() {
    super(BidOrder)
  }
}
