import AdminUser from 'App/Models/adminUser/AdminUser'
import User from 'App/Models/user/User'
import VenderUser from 'App/Models/venderUser/VenderUser'

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

export const isVender = (user: VenderUser | User | AdminUser) => {
  if (user instanceof VenderUser) {
    return true
  } else {
    false
  }
}