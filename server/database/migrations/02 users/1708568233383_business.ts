import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'businesses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.json('avatar')
      table.string('name').unique().notNullable()
      table.integer('vender_user_id').unsigned().notNullable().references('id').inTable('vender_users').onDelete('CASCADE')
      table.json('logo')
      table.json('cover')
      table.json('video')
      table.json('brocher')

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
