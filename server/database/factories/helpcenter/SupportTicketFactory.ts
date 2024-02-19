import Factory from '@ioc:Adonis/Lucid/Factory'
import { TicketStatus } from 'App/Helpers/enums'
import SupportTicket from 'App/Models/helpcenter/SupportTicket'

export default Factory.define(SupportTicket, ({ faker }) => {
  return {
    subject: faker.lorem.lines(),
    status: TicketStatus.OPEN,
    userId: faker.number.int({ min: 1, max: 5 }),
  }
}).build()
