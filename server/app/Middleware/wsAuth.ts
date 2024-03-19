import User from 'App/Models/user/User'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import AdminUser from 'App/Models/adminUser/AdminUser'
import VendorUser from 'App/Models/vendorUser/VendorUser'

const wsAuth = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.headers['socket-token']
  const userId = socket.handshake.headers['user-id']

  if (!token || !userId) {
    next(new Error('Unauthorized'))
    return
  }

  const user = await User.findBy('id', userId)
  const admin = await AdminUser.findBy('id', userId)
  const vendor = await VendorUser.findBy('id', userId)

  if (!user && !admin && !vendor) {
    return next(new Error('Unauthorized'))
  }

  if (admin) {
    const isTokenValid = token == admin.socketToken

    if (isTokenValid) {
      socket.handshake.auth.user = admin
      next()
      return
    }
  } else if (user) {
    const isTokenValid = token == user.socketToken
    if (isTokenValid) {
      socket.handshake.auth.user = user
      next()
      return
    }
  } else if (vendor) {
    const isTokenValid = token == vendor.socketToken
    if (isTokenValid) {
      socket.handshake.auth.user = user
      next()
      return
    }
  }
  next(new Error('Unauthorized'))
}

export default wsAuth
