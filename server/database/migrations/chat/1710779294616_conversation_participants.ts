import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { userTypes } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'conversation_participants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('user_type', Object.values(userTypes)).notNullable()
      table.integer('conversation_id').references('id').inTable('conversations').notNullable()
      table.integer('user_id').references('id').inTable('users')
      table.integer('vendor_user_id').references('id').inTable('vendor_users')
      table.integer('admin_user_id').references('id').inTable('admin_users')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
