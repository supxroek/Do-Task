// server/api/auth/login.post.ts
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";
import { issueAuthCookies, toPublicUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      success: false,
      status: 401,
      message: "Email or password is incorrect",
    };
  }

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return {
      success: false,
      status: 401,
      message: "Email or password is incorrect",
    };
  }

  await issueAuthCookies(event, user);

  return {
    success: true,
    status: 200,
    message: "Login successful",
    user: toPublicUser(user),
  };
});
