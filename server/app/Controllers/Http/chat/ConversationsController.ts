import BaseController from '../BaseController'
import Conversation from 'App/Models/chat/Conversation'
import ConversationValidator from 'App/Validators/chat/ConversationValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import Database from '@ioc:Adonis/Lucid/Database'
import { userTypes } from 'App/Helpers/enums'
import MessageValidator from 'App/Validators/chat/MessageValidator'
import Message from 'App/Models/chat/Message'

export default class ConversationsController extends BaseController {
  constructor() {
    super(Conversation, ConversationValidator, ConversationValidator, 'ConversationPolicy')
  }

  public getIndexQuery(ctx: HttpContextContract) {
    const user = ctx.auth.user

    return user ? (user as AdminUser).related('conversations').query() : null
  }

  public async getConversationMessages({
    response,
    params,
    bouncer,
    request,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)

    await bouncer.with('ConversationPolicy').authorize('view', conversation)

    let messages: Message[] = []

    const messagesQuery = Message.query().where('conversation_id', conversation.id)

    this.indexfilterQuery(request.qs() as any, messagesQuery)

    messages = await messagesQuery.paginate(
      request.qs().page,
      request.qs().rowsPerPage || this.perPage
    )

    return response.custom({
      code: 200,
      message: null,
      data: messages,
      success: true,
    })
  }

  public async store({
    request,
    response,
    bouncer,
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    await bouncer.with('ConversationPolicy').authorize('create')
    const payload = await request.validate(ConversationValidator)

    let conversation: Conversation | null = null

    conversation = await Conversation.query()
      .whereHas('participant', (p) => {
        if (auth.user?.userType === userTypes.USER) {
          p.where('user_id', auth.user.id)
        }

        if (auth.user?.userType === userTypes.VENDER) {
          p.where('vendor_user_id', auth.user.id)
        }

        if (auth.user?.userType === userTypes.ADMIN) {
          p.where('admin_user_id', auth.user.id)
        }
      })
      .andWhereHas('participant', (p) => {
        for (const participant of payload.participant) {
          if (participant.userType == userTypes.USER) {
            p.where('user_id', participant.userId)
          }

          if (participant.userType == userTypes.VENDER) {
            p.where('vendor_user_id', participant.userId)
          }

          if (participant.userType == userTypes.ADMIN) {
            p.where('admin_user_id', participant.userId)
          }
        }
      })
      .first()

    if (conversation) {
      return response.custom({
        code: 200,
        message: 'Conversation already exist',
        success: true,
        data: conversation,
      })
    }

    if (!conversation) {
      await Database.transaction(async (trx) => {
        conversation = await Conversation.create({ name: payload.name }, { client: trx })
        if (auth.user?.userType === userTypes.USER) {
          await conversation.related('participant').create({
            userType: userTypes.USER,
            userId: auth.user.id,
          })
        }

        if (auth.user?.userType === userTypes.VENDER) {
          await conversation.related('participant').create({
            userType: userTypes.VENDER,
            vendorUserId: auth.user.id,
          })
        }

        if (auth.user?.userType === userTypes.ADMIN) {
          await conversation.related('participant').create({
            userType: userTypes.ADMIN,
            adminUserId: auth.user.id,
          })
        }

        for (const participant of payload.participant) {
          if (participant.userType === userTypes.USER) {
            await conversation.related('participant').create({
              userType: participant.userType,
              userId: participant.userId,
            })
          }

          if (participant.userType === userTypes.VENDER) {
            await conversation.related('participant').create({
              userType: participant.userType,
              vendorUserId: participant.userId,
            })
          }

          if (participant.userType === userTypes.ADMIN) {
            await conversation.related('participant').create({
              userType: participant.userType,
              adminUserId: participant.userId,
            })
          }
        }
      })
    }

    return response.custom({
      code: 201,
      message: 'Conversation Created',
      success: true,
      data: conversation,
    })
  }

  public async createMessage({
    request,
    response,
    bouncer,
    params,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    const payload = await request.validate(MessageValidator)

    conversation.related('messages').create(payload)

    return response.custom({
      code: 201,
      message: 'Message Created',
      success: true,
      data: null,
    })
  }

  public async markAllAsRead({
    response,
    bouncer,
    params,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    await conversation.related('messages').query().where('read', 0).update({ read: 0 }).exec()

    return response.custom({
      code: 201,
      message: 'Marked As read',
      success: true,
      data: null,
    })
  }
}
