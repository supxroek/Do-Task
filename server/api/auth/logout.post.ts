// server/api/auth/logout.post.ts
import { clearAuthCookies } from "../../utils/auth";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revoked: false },
      data: { revoked: true },
    });
  }

  clearAuthCookies(event);

  return {
    success: true,
    status: 200,
    message: "Logout successful",
  };
});
