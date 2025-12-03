import { ForbiddenError } from "@errors/forbidden-error"

export const HasPermission = ({
  auth,
  resourceId
}: { auth: { userId: string, admin: boolean }, resourceId: string}): void => {
  if (
    auth.userId.toString() !== resourceId &&
    !auth.admin
  ) {
    throw new ForbiddenError()
  }
}