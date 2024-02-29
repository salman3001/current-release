import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import BidOrder from 'App/Models/orders/BidOrder'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import { permissions } from 'App/Helpers/enums'
import AdminUser from 'App/Models/adminUser/AdminUser'
import VendorUser from 'App/Models/vendorUser/VendorUser'

export default class BidOrderPolicy extends BasePolicy {
  public async viewList(user: User | AdminUser) {
    if (isAdmin(user) && (await hasPermission(user as AdminUser, permissions.MANAGE_BID_ORDERS))) {
      return true
    } else {
      false
    }
  }
  public async view(user: User, bidOrder: BidOrder) {
    if (user instanceof User && bidOrder.userId == user.id) {
      return true
    } else if (user instanceof VendorUser && bidOrder.userId == user.id) {
      return true
    } else {
      return false
    }
  }
  public async create(user: User) {}
  public async update(user: User, bidOrder: BidOrder) {}
  public async delete(user: User, bidOrder: BidOrder) {}
}
