import NotificationController from 'App/Controllers/ws/NotificationController'
import TicketChatController from 'App/Controllers/ws/TicketChatController'
import wsAuth from 'App/Middleware/wsAuth'
import Ws from 'App/services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

const userSocketIo = Ws.io.of('/notifications/').use(wsAuth)
const ticketChatIo = Ws.io.of('/ticket_chat/').use(wsAuth)

ticketChatIo.on('connection', (socket) => {
  const controller = new TicketChatController(socket, ticketChatIo)
  controller.execute()
})

userSocketIo.on('connection', (socket) => {
  const controller = new NotificationController(socket, userSocketIo)
  controller.execute()
})
