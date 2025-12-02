import { env } from "@env";
import { BadRequestError } from "@errors/bad-request.error";
import { NotFoundError } from "@errors/not-found.error";
import { compareSync } from "bcrypt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { database } from "src/database";
import { z } from "zod";

export async function AuthRoute (app: FastifyInstance) {
  app.post('/login', async (req: FastifyRequest, rep: FastifyReply) => {
    const { body } = req

    const loginBodySchema = z.object({
      email: z.email(),
      password: z.string()
    })

    const parseLoginBodySchema = loginBodySchema.safeParse(body)

    if (!parseLoginBodySchema.success) {
      throw new BadRequestError()
    }

    const { email, password } = parseLoginBodySchema.data

    const user = await database('users')
      .select('*')
      .where('email', email)
      .first()

    if (!user) {
      throw new NotFoundError()
    }

    if (!compareSync(password, user!.password)) {
      throw new BadRequestError()
    }

    const token = app.jwt.sign({ sub: user!.id, email: user!.email, admin: user!.privilegeAdmin });

    rep.cookie('token', `Bearer ${token}`, {
      path: '/',
      maxAge: env!.JWT_EXPIRATION_TIME
    });

    rep.status(200).send();
  })

  app.get('/logout', (_, rep: FastifyReply) => {
    rep.clearCookie('token', { path: '/' }).status(200).send();
  });
}