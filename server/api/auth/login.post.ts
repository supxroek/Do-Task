// server/api/auth/login.post.ts

import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return {
      status: 400,
      message: "Email and password are required",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return {
      status: 401,
      message: "Invalid password",
    };
  }

  // Create a cookie and token for the user
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.NUXT_JWT_SECRET!,
    { expiresIn: "1h" },
  );

  setCookie(event, "token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60, // 1 hour
  });

  return {
    status: 200,
    message: "Login successful",
    // token,
  };
});
