import { BadRequestError } from "@errors/bad-request.error";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { database } from "src/database";
import { z } from "zod";
import { hash } from 'bcrypt'
import { env } from "@env";
import { randomUUID } from "node:crypto";
import { NotFoundError } from "@errors/not-found.error";
import { Auth } from "@middlewares/auth";
import { HasPermission } from "@utils/has-permission";
import { CheckIfIsAdmin } from "@utils/check-if-is-admin";

export async function UsersRoute (app: FastifyInstance) {
  app.get('/', {preHandler: Auth }, async (req: FastifyRequest) => {
    const { auth } = req
    CheckIfIsAdmin({ admin: auth.admin })

    return database('users').select('id', 'name', 'email', 'privilegeAdmin')
  })

  app.get('/:id', async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }

    if (!id) {
      throw new BadRequestError()
    }

    const user = await database('users')
      .where('id', id)
      .select('id', 'name', 'email', 'privilegeAdmin')
      .first()

    if (!user) {
      throw new NotFoundError()
    }

    return user
  })

  app.post('/', async (req: FastifyRequest, rep: FastifyReply) => {
    const { body } = req

    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(8),
      privilegeAdmin: z.boolean().default(false)
    })

    const parseBodySchema = bodySchema.safeParse(body)

    if (!parseBodySchema.success) {
      throw new BadRequestError()
    }

    const password = await hash(parseBodySchema.data.password, env!.HASH_SALT)

    const user = await database('users').insert({
      id: randomUUID(),
      ...parseBodySchema.data,
      password
    }, ['id', 'name', 'email', 'privilegeAdmin'])

    rep.status(201).send(user[0])
  })

  app.patch('/:id', {preHandler: Auth }, async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { auth } = req
    const { body } = req

    const bodySchema = z.object({
      name: z.string().optional(),
      email: z.email().optional(),
    })

    const parseBodySchema = bodySchema.safeParse(body)

    if (!parseBodySchema.success || !id) {
      throw new BadRequestError()
    }

    const user = await database('users')
      .where('id', id)
      .first()

    if (!user) {
      throw new NotFoundError()
    }

    HasPermission({ auth, resourceId: user.id })
    const { data } = parseBodySchema

    const userUpdated = await database('users')
      .where('id', id)
      .update({ email: data.email!, name: data.name! }, ['id', 'name', 'email', 'privilegeAdmin'])
      
    rep.status(200).send(userUpdated[0])
  })

  app.delete('/:id', {preHandler: Auth }, async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { auth } = req

    if (!id) {
      throw new BadRequestError()
    }

    const user = await database('users')
      .where('id', id)
      .select('id', 'name', 'email', 'privilegeAdmin')
      .first()

    if (!user) {
      throw new NotFoundError()
    }

    HasPermission({ auth, resourceId: user.id })

    await database('users')
      .where('id', id)
      .del()

    rep.status(204)
  })
}