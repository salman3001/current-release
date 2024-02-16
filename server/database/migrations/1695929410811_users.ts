import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.string('socket_token').nullable()
      table.string('first_name', 50)
      table.string('last_name')
      table.string('user_name')
      table.string('phone', 15)
      table.string('desc')
      table.boolean('is_active').defaultTo(false).notNullable()
      table.boolean('is_vender').defaultTo(false).notNullable()
      table.boolean('is_public').defaultTo(true)
      table.json('avatar')
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
