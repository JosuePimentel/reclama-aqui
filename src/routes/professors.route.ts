import { BadRequestError } from "@errors/bad-request.error";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { database } from "src/database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { NotFoundError } from "@errors/not-found.error";
import { Auth } from "@middlewares/auth";

export async function ProfessorsRoute (app: FastifyInstance) {
  app.get('/', async () => {
    return database('professors').select('*')
  })

  app.get('/:id', async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }

    if (!id) {
      throw new BadRequestError()
    }

    const professor = await database('professors')
      .where('id', id)
      .select('*')
      .first()

    if (!professor) {
      throw new NotFoundError()
    }

    
    const comments = await database('comments')
      .where('professor_id', professor.id)
    const commentsArray = []

    for (const commentData of comments) {
      const { user_id: userId, comment, score } = commentData
      const user = await database('users').where('id', userId).select('name').first()
      commentsArray.push({
        comment,
        score,
        id: userId,
        userName: user?.name
      })
    }

    const professorData = {
      ...professor,
      comments: commentsArray,
      score: commentsArray.length
        ? Math.floor(commentsArray.reduce((acc, c) => acc + (c.score/commentsArray.length), 0))
        : null
    }

    return professorData
  })

  app.post('/', async (req: FastifyRequest, rep: FastifyReply) => {
    const { body } = req

    const bodySchema = z.object({
      name: z.string(),
      photo: z.string().default(''),
    })

    const parseBodySchema = bodySchema.safeParse(body)

    if (!parseBodySchema.success) {
      throw new BadRequestError()
    }

    const professor = await database('professors').insert({
      id: randomUUID(),
      ...parseBodySchema.data,
    }, '*')

    rep.status(201).send(professor[0])
  })

  app.patch('/:id', async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { body } = req

    const bodySchema = z.object({
      name: z.string().optional(),
      photo: z.string().optional(),
    })

    const parseBodySchema = bodySchema.safeParse(body)

    if (!parseBodySchema.success || !id) {
      throw new BadRequestError()
    }

    const professor = await database('professors')
      .where('id', id)
      .first()

    if (!professor) {
      throw new NotFoundError()
    }

    const { data } = parseBodySchema

    const professorUpdated = await database('professors')
      .where('id', id)
      .update({ photo: data.photo!, name: data.name! }, '*')
      
    rep.status(200).send(professorUpdated[0])
  })

  app.delete('/:id', async (req: FastifyRequest, rep: FastifyReply) => {
    const { id } = req.params as { id: string }

    if (!id) {
      throw new BadRequestError()
    }

    const professor = await database('professors')
      .where('id', id)
      .select('*')
      .first()

    if (!professor) {
      throw new NotFoundError()
    }

    await database('professors')
      .where('id', id)
      .del()

    rep.status(204)
  })
}