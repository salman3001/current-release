import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'socials'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('website')
      table.string('facebook')
      table.string('twitter')
      table.string('instagram')
      table.string('pintrest')
      table.string('linkedin')
      table.string('vk')
      table.string('whatsapp')
      table.string('telegram')
      table
        .integer('admin_user_id')
        .unsigned()
        .references('id')
        .inTable('admin_users')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
