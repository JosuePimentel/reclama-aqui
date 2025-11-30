import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('users', table => {
    table.uuid('id').primary()
    table.string('name').index().notNullable()
    table.string('email').index().notNullable()
    table.string('password').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users')
}

