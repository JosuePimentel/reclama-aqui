import { Knex } from "knex";

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      privilegeAdmin: boolean
    },
    professors: {
      id: string
      name: string
      photo: string
    },
    comments: {
      id: string
      user_id: string
      professor_id: string
      comment: string
      score: number
    }
  }
}