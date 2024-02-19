import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'

export const hasPermission = async (user: AdminUser, permission: string) => {
  await user.load('role')
  if (user?.role) {
    if (user?.role?.name === 'Super Admin') {
      return true
    }

    if (user?.role?.isActive == false) {
      return false
    }

    if ((user.role?.permissions as string[])?.includes(permission)) {
      return true
    }
    return false
  }
}

export const isAdmin = (user: AdminUser | User) => {
  if (user instanceof AdminUser) {
    return true
  } else {
    false
  }
}
