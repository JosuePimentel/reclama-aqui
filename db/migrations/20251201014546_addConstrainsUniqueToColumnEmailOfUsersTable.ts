import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.unique(["email"], "users_email_unique");
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.dropUnique(["email"], "users_email_unique");
  })
}

