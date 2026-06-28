// server/api/auth/me.get.ts
import { toPublicUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  // Get user from context (set by auth middleware)
  const user = event.context.user;

  if (!user) {
    return {
      success: false,
      status: 401,
      message: "Unauthorized",
    };
  }

  // Return user data (excluding password)
  return {
    success: true,
    status: 200,
    message: "User retrieved successfully",
    user: toPublicUser(user),
  };
});
