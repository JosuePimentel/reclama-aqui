import { ForbiddenError } from "@errors/forbidden-error"

export const checkIds = ({
  auth,
  resourceId
}: { auth: { userId: string, admin: boolean }, resourceId: string}) => {
  if (
    auth.userId.toString() !== resourceId &&
    !auth.admin) {
    throw new ForbiddenError()
  }
}
