import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'countries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 50).notNullable()
      table.boolean('is_active').defaultTo(false).notNullable()
      table
        .integer('continent_id', 10)
        .unsigned()
        .references('id')
        .inTable('continents')
        .onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
