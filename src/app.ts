import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { BadRequestError } from "@errors/bad-request.error.js";
import { UsersRoute } from "@routes/users.route";

export const app = fastify()

app.register(fastifyCookie)

app.setErrorHandler((error, _req, rep) => {
  if (error instanceof BadRequestError) {
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