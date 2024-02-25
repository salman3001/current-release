import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/user/User'
import Order from 'App/Models/Order'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import AdminUser from 'App/Models/adminUser/AdminUser'
import { hasPermission, isAdmin } from 'App/Helpers/permissionHelpers'
import { permissions } from 'App/Helpers/enums'

export default class OrderPolicy extends BasePolicy {
	public async viewList(user: User | VendorUser | AdminUser) {
		if (isAdmin(user) && (await hasPermission(user as AdminUser, permissions.MANAGE_ORDERS))) {
			return true
		} else {
			return false
		}

	}

	public async ownList(user: User | VendorUser | AdminUser) {
		if ((user instanceof User || user instanceof VendorUser)) {
			return true
		}
		else {
			return false
		}
	}
	public async view(user: User, order: Order) {
		if (isAdmin(user) && (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_ORDERS))) {
			return true
		} else if (user instanceof User && user.id == order.userId) {
			return true
		} else if (user instanceof VendorUser && user.id == order.vendorUserId) {
			return true
		}
		else {
			return false
		}

	}

	public async create(user: User) {
		if (user instanceof User) {
			return true
		}
		else {
			return false
		}
	}
	public async update(user: User, order: Order) {
		if (isAdmin(user) && (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_ORDERS))) {
			return true
		} else if (user instanceof VendorUser && user.id == order.vendorUserId) {
			return true
		}
		else {
			return false
		}

	}
	public async delete(user: User) {
		if (isAdmin(user) && (await hasPermission(user as unknown as AdminUser, permissions.MANAGE_ORDERS))) {
			return true
		} else {
			return false
		}
	}
}
