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
        .integer('admin_user_profile_id')
        .unsigned()
        .references('id')
        .inTable('admin_user_profiles')
        .onDelete('CASCADE')
      table.integer('user_profile_id').unsigned().references('id').inTable('user_profiles').onDelete('CASCADE')
      table
        .integer('businesses_id')
        .unsigned()
        .references('id')
        .inTable('businesses')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
