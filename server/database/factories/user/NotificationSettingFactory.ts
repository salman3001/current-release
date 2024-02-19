import NotificationSetting from 'App/Models/NotificationSetting'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(NotificationSetting, () => {
  return {
    onCommentReply: true,
    onMessageRecieve: false,
    onOffers: true,
    onServiceUpdate: true,
  }
}).build()
