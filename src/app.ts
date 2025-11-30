import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { BadRequestError } from "@errors/bad-request.error.js";
import { UsersRoute } from "@routes/users.route";
import { ProfessorsRoute } from "@routes/professors.route";
import { CommentsRoute } from "@routes/comments.route";
import { NotFoundError } from "@errors/not-found.error";

export const app = fastify()

app.register(fastifyCookie)

app.setErrorHandler((error, _req, rep) => {
  if (
    error instanceof BadRequestError ||
    error instanceof NotFoundError
  ) {
    return rep.status(error.statusCode).send({
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return rep.status(500).send({
    error: "InternalServerError",
    message: "Unexpected error occurred",
  });
})

app.register(UsersRoute, {
  prefix: '/users'
})

app.register(ProfessorsRoute, {
  prefix: '/professors'
})

app.register(CommentsRoute, {
  prefix: '/comments'
})