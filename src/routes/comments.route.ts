import { BadRequestError } from "@errors/bad-request.error"
import { NotFoundError } from "@errors/not-found.error"
import { Auth } from "@middlewares/auth"
import { HasPermission } from "@utils/has-permission"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { randomUUID } from "node:crypto"
import { database } from "src/database"
import { z } from "zod"

export async function CommentsRoute (app: FastifyInstance) {
  app.post('/', { preHandler: Auth }, async (req: FastifyRequest, rep: FastifyReply) => {
    const { body, auth } = req

    const bodySchema = z.object({
      user_id: z.uuidv4(),
      professor_id: z.uuidv4(),
      comment: z.string().max(500),
      score: z.number().gt(0).lt(5),
    })

    const parseBodySchema = bodySchema.safeParse(body)

    if (!parseBodySchema.success) {
      throw new BadRequestError()
    }

    const bodyToInsert = parseBodySchema.data

    const user = await database('users').where('id', bodyToInsert.user_id).first()
    const professor = await database('professors').where('id', bodyToInsert.professor_id).first()

    if ( !user || !professor ) {
      throw new NotFoundError()
    }

    const comment = await database('comments')
      .insert({
        id: randomUUID(),
        ...bodyToInsert
      }, '*')

    rep.status(201).send(comment[0])
  })

  app.delete('/:id', { preHandler: Auth }, async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { auth } = req

    if (!id) {
      throw new BadRequestError()
    }

    const comment = await database('comments')
      .where('id', id)
      .first()

    if (!comment) {
      throw new NotFoundError()
    }

    HasPermission({ auth, resourceId: comment.user_id })

    await database('comments')
      .where('id', id)
      .del()

    rep.send(204)
  })
}