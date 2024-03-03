import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Notification from 'App/Models/Notification'
import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import BaseController, { IndexQs } from './BaseController'
import { filterRecords } from 'App/Helpers/filters'

export default class NotificationsController extends BaseController {
  constructor() {
    super(Notification, {}, {}, 'NotificationPolicy')
  }
  public async index({ request, response, auth }: HttpContextContract) {
    const user = auth.user
    let qs = request.qs() as IndexQs
    if (!user) {
      return response.unauthorized()
    }
    let records: any[] = []

    if (user instanceof AdminUser) {
      const newQs: IndexQs = {
        ...qs,
        sortBy: 'created_at',
        filter: { admin_user_id: user.id.toString() },
      }
      records = await filterRecords(Notification, newQs)
    }

    if (user instanceof User) {
      const newQs: IndexQs = { ...qs, filter: { user_id: user.id.toString() } }
      records = await filterRecords(Notification, newQs)
    }

    return response.custom({
      message: null,
      code: 200,
      data: records,
      success: true,
    })
  }

  public async getMenuNotifications({ response, auth }: HttpContextContract) {
    const user = auth.user as AdminUser

    let notifcations: any[] = []
    let count: any = 0

    if (user) {
      await user.load('notifications', (b) => {
        b.orderBy('created_at').limit(20)
      })

      if (user instanceof AdminUser) {
        const query = await Database.query()
          .from('notifications')
          .select('id')
          .where('admin_user_id', user.id)
          .groupBy('id')
          .count('* as count')
          .first()

        count = query.count
      }

      if (user instanceof User) {
        const query = await Database.query()
          .from('notifications')
          .select('id')
          .where('user_id', user.id)
          .groupBy('id')
          .count('* as count')
          .first()

        count = query.count
      }

      notifcations = user.notifications
    }

    return response.custom({
      message: null,
      code: 200,
      data: { notifcations, count },
      success: true,
    })
  }

  public async destroyRead({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (user) {
      await (user as AdminUser).load('notifications', (n) => {
        n.whereNotNull('read_at')
      })

      for (const n of user.notifications) {
        await n.delete()
      }
    }

    return response.custom({
      message: 'Notification deleted',
      code: 200,
      data: null,
      success: true,
    })
  }

  public async destroyAll({ response, auth }: HttpContextContract) {
    const user = auth.user

    if (user) {
      await (user as AdminUser).load('notifications')

      for (const n of user.notifications) {
        await n.delete()
      }
    }

    return response.custom({
      message: 'All Notification deleted',
      code: 200,
      data: null,
      success: true,
    })
  }

  public async markAsRead({ response, params }: HttpContextContract) {
    const id = +params.id
    const notification = await Notification.findOrFail(id)
    await notification.markAsRead()
    return response.custom({
      message: 'Notification marked as read',
      code: 200,
      data: notification,
      success: true,
    })
  }
}
