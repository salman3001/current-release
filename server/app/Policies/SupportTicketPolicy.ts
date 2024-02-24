import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'
import VenderUser from 'App/Models/venderUser/VenderUser'

export default class SupportTicketPolicy extends BasePolicy {
  public async viewList(user: any) {
    if (user) {
      return true
    } else {
      return false
    }
  }

  public async view(user: any, ticket: SupportTicket) {
    if (user instanceof VenderUser && ticket.venderUserId == user.id) {
      return true
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    } else {
      return false
    }
  }

  @action({ allowGuest: true })
  public async create(user: any) {
    return true
  }

  public async update(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: any) {
    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_TICKETS))) {
      return true
    } else {
      return false
    }
  }
}
