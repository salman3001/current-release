import FavoriteLink from 'App/Models/FavoriteLink'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(FavoriteLink, ({ faker }) => {
  return {
    link: faker.internet.domainName(),
  }
}).build()
