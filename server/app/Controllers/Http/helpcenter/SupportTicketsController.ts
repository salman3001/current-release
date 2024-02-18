import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'
import BaseController from '../BaseController'
import { TicketStatus } from 'App/Helpers/enums'
import SupportTicketCreateValidator from 'App/Validators/helpcenter/SupportTicketCreateValidator'
import ChatMessage from 'App/Models/helpcenter/ChatMessage'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'

export default class SupportTicketsController extends BaseController {
  constructor() {
    super(
      SupportTicket,
      SupportTicketCreateValidator,
      SupportTicketCreateValidator,
      'SupportTicketPolicy'
    )
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SupportTicketPolicy').authorize('create')
    const payload = await request.validate(SupportTicketCreateValidator)
    const { message, ...restPayload } = payload
    const ticket = await SupportTicket.create(restPayload)
    if (message) {
      await ticket.related('messages').create({ message: message, type: 'User' })
    }
    const user = await AdminUser.findBy('id', 1)
    await user?.related('notifications').create({
      data: {
        message: 'New Support Ticket added',
      },
    })
    return response.custom({
      message: 'Ticket created',
      code: 201,
      data: ticket,
      status: true,
      alertType: 'success'
    })
  }

  public async changeStatus({ params, response, bouncer, request }: HttpContextContract) {
    const status = request.input('status') as TicketStatus
    bouncer.with('SupportTicketPolicy').authorize('update')
    const ticket = await SupportTicket.findOrFail(+params.id)

    ticket.status = status
    await ticket.save()
    return response.custom({
      message: 'Ticket Status changed',
      code: 200,
      data: ticket,
      status: true,
      alertType: 'success'
    })
  }

  public async ticketMessages({ params, response, bouncer, request }: HttpContextContract) {
    const limit = request.qs().limit
    const page = request.qs().page
    const ticket = await SupportTicket.findOrFail(+params.id)
    bouncer.with('SupportTicketPolicy').authorize('view', ticket)

    const messages = await ChatMessage.query()
      .where('support_ticket_id', ticket.id)
      .orderBy('created_at', 'desc')
      .paginate(page ?? 1, limit ?? 20)

    return response.custom({
      message: '',
      code: 200,
      data: messages,
      status: true,
      alertType: null
    })
  }

  public async createMessage({ params, response, bouncer, request, auth }: HttpContextContract) {
    const message = await request.input('message')
    const ticket = await SupportTicket.findOrFail(+params.id)
    bouncer.with('SupportTicketPolicy').authorize('view', ticket)

    if (message) {
      if (auth.user instanceof AdminUser)
        ticket.related('messages').create({
          message,
          type: 'AdminUser',
        })

      if (auth.user instanceof User)
        ticket.related('messages').create({
          message,
          type: 'User',
        })
    }

    return response.custom({
      message: 'Message Created',
      code: 201,
      data: message,
      status: true,
      alertType: 'success'
    })
  }
}
