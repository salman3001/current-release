import ServiceProperty from 'App/Models/service/ServiceProperty'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(ServiceProperty, ({ faker }) => {
  return {
    name: faker.word.sample(),
    value: faker.word.sample(),
  }
}).build()
