import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'service_variants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.decimal('price', 8, 2).notNullable()
      table.integer('available_qty').defaultTo(1)
      table.boolean('has_inifiite_qty').defaultTo(false)
      table.integer('flat_discount')
      table.json('features')
      table.json('included')
      table.json('excluded')
      table.json('additional_properties')
      table.bigInteger('order').defaultTo(1).notNullable()
      table.json('image')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
