import { BadRequestError } from "@errors/bad-request.error";
import { NotAuthorizedError } from "@errors/not-authorized.error";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function Auth (req: FastifyRequest, rep: FastifyReply) {
  try {
    const [_, token] = req.cookies.token!.split(' ')
    
    if (!token) {
      throw new NotAuthorizedError()
    }

    req.server.jwt.verify(token)

    const tokenDecoded = req.server.jwt.decode<{ sub: string, admin: boolean }>(token)

    req.auth = {
      userId: tokenDecoded!.sub,
      admin: tokenDecoded!.admin
    }
  } catch (error) {
    throw new NotAuthorizedError()
  }
}