import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admin_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.string('socket_token').nullable()
      table.string('first_name', 50)
      table.string('last_name')
      table.string('phone', 15)
      table.string('desc')
      table.boolean('is_active').defaultTo(false).notNullable()
      table.boolean('is_admin').defaultTo(true).notNullable()
      table.json('avatar')
      table.integer('role_id').unsigned().references('roles.id').onDelete('SET NULL')
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
