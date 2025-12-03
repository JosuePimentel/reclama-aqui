import { ForbiddenError } from "@errors/forbidden-error"

export const CheckIfIsAdmin = ({ admin }: { admin: boolean }): void => {
  if (!admin) {
    throw new ForbiddenError()
  }
}