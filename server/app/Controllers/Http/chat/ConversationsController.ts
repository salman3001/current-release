import BaseController from '../BaseController'
import Conversation from 'App/Models/chat/Conversation'
import ConversationValidator from 'App/Validators/chat/ConversationValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { userTypes } from 'App/Helpers/enums'
import MessageValidator from 'App/Validators/chat/MessageValidator'
import Message from 'App/Models/chat/Message'
import User from 'App/Models/user/User'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import Database from '@ioc:Adonis/Lucid/Database'
import ConversationParticipant from 'App/Models/chat/ConversationParticipant'

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
      .whereHas('participantOne', (p) => {
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
      .andWhereHas('participantTwo', (p) => {
        if (payload.participant.userType == userTypes.USER) {
          p.where('user_id', payload.participant.userId)
        }

        if (payload.participant.userType == userTypes.VENDER) {
          p.where('vendor_user_id', payload.participant.userId)
        }

        if (payload.participant.userType == userTypes.ADMIN) {
          p.where('admin_user_id', payload.participant.userId)
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
          const participantOne = await ConversationParticipant.create(
            {
              userId: auth.user.id,
              userIdentifier: `${userTypes.USER}-${auth.user.id}`,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
        }

        if (auth.user?.userType === userTypes.VENDER) {
          const participantOne = await ConversationParticipant.create(
            {
              vendorUserId: auth.user.id,
              userIdentifier: `${userTypes.VENDER}-${auth.user.id}`,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
        }

        if (auth.user?.userType === userTypes.ADMIN) {
          const participantOne = await ConversationParticipant.create(
            {
              adminUserId: auth.user.id,
              userIdentifier: `${userTypes.ADMIN}-${auth.user.id}`,
            },
            { client: trx }
          )

          await conversation.related('participantOne').associate(participantOne)
        }

        if (payload.participant.userType == userTypes.USER) {
          const participantTwo = await ConversationParticipant.create(
            {
              userId: payload.participant.userId,
              userIdentifier: `${userTypes.USER}-${payload.participant.userId}`,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
        }

        if (payload.participant.userType == userTypes.VENDER) {
          const participantTwo = await ConversationParticipant.create(
            {
              vendorUserId: payload.participant.userId,
              userIdentifier: `${userTypes.VENDER}-${payload.participant.userId}`,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
        }

        if (payload.participant.userType == userTypes.ADMIN) {
          const participantTwo = await ConversationParticipant.create(
            {
              adminUserId: payload.participant.userId,
              userIdentifier: `${userTypes.ADMIN}-${payload.participant.userId}`,
            },
            { client: trx }
          )

          await conversation.related('participantTwo').associate(participantTwo)
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
    auth,
  }: HttpContextContract): Promise<ResponseContract> {
    const conversation = await Conversation.findOrFail(+params.id)
    await bouncer.with('ConversationPolicy').authorize('update', conversation)

    const payload = await request.validate(MessageValidator)

    const message = new Message()
    message.body = payload.body
    message.conversationId = conversation.id
    if (auth.user instanceof User) {
      message.userIdentifier = `${userTypes.USER}-${auth.user.id}`
    }
    if (auth.user instanceof VendorUser) {
      message.userIdentifier = `${userTypes.VENDER}-${auth.user.id}`
    }

    if (auth.user instanceof AdminUser) {
      message.userIdentifier = `${userTypes.ADMIN}-${auth.user.id}`
    }

    await message.save

    return response.custom({
      code: 201,
      message: 'Message Created',
      success: true,
      data: message,
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
