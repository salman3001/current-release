import User from 'App/Models/user/User'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import AdminUser from 'App/Models/adminUser/AdminUser'

const wsAuth = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.auth?.socketToken
  if (!token) return next(new Error('Unauthorized'))
  const user = await User.findBy('id', socket.handshake.auth.userId)
  const admin = await AdminUser.findBy('id', socket.handshake.auth.userId)

  if (!user && !admin) {
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
  } else {
    next(new Error('Unauthorized'))
  }
}

export default wsAuth
