import knex, { type Knex } from 'knex';
import { env } from '@env';

export const config: Knex.Config = {
  client: env!.ENVIRONMENT === 'dev' ? 'sqlite3' : 'pg',
  connection: env!.ENVIRONMENT !== 'dev' ? env!.DATABASE_URL : {
    filename: env!.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  }
}

export const database = knex(config);