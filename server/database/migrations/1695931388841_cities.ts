import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.boolean('is_active').defaultTo(false).notNullable()
      table.integer('state_id').unsigned().references('id').inTable('states').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
