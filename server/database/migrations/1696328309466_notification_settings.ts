import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notification_settings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.boolean('on_message_recieve').defaultTo(true)
      table.boolean('on_comment_reply').defaultTo(true)
      table.boolean('on_product_update').defaultTo(true)
      table.boolean('on_offers').defaultTo(true)
      table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
