import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('comments', table => {
    table.uuid('user_id').primary()
    table.uuid('professor_id').primary()
    table.string('comment').checkLength('<=', 500).notNullable()
    table.integer('score').checkBetween([0, 5]).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comments')
}

