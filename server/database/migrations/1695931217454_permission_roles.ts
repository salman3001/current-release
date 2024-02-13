import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'permission_role'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .notNullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
