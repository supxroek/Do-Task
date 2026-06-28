// server/middleware/auth.ts
import { getAuthenticatedUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
  event.context.user = await getAuthenticatedUser(event);
});
