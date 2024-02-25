import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'businesses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable()
      table.string('short_desc')
      table.text('long_desc')
      table.boolean('is_active')
      table.json('logo')
      table.json('cover')
      table.json('brocher')
      table.json('video')
      table
        .integer('vendor_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('vendor_users')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
