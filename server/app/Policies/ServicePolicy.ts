import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import { permissions } from 'App/Helpers/enums'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import Service from 'App/Models/service/Service'
import VenderUser from 'App/Models/venderUser/VenderUser'

export default class ServicePolicy extends BasePolicy {
  @action({ allowGuest: true })
  public async viewList(user: any) {
    return true
  }

  @action({ allowGuest: true })
  public async view(user: any) {
    return true
  }

  public async create(user: any) {
    if (user instanceof VenderUser) {
      return true
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SERVICE))) {
      return true
    } else {
      return false
    }
  }

  public async update(user: any, service: Service) {
    if (user instanceof VenderUser) {
      await user.load('business')
      if (user.business.id == service.businessId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SERVICE))) {
      return true
    } else {
      return false
    }
  }

  public async delete(user: any, service: Service) {
    if (user instanceof VenderUser) {
      await user.load('business')
      if (user.business.id == service.businessId) {
        return true
      }
    }

    if (isAdmin(user) && (await hasPermission(user, permissions.MANAGE_SERVICE))) {
      return true
    } else {
      return false
    }
  }
}
