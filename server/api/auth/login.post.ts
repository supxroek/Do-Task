// server/api/auth/login.post.ts

import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // 1. Validate the input
  if (!email || !password) {
    throw createError({
      status: 400,
      message: "Email and password are required",
    });
  }

  // 2. Check if the user exists in the database
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw createError({
      status: 404,
      message: "User not found",
    });
  }

  // 3. Compare the provided password
  if (!(await bcrypt.compare(password, user.password))) {
    throw createError({
      status: 401,
      message: "Invalid password",
    });
  }

  // 4. Create a cookie and token for the user
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.NUXT_JWT_SECRET!,
    { expiresIn: "1h" },
  );

  // 5. Set the cookie in the response
  setCookie(event, "token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60, // 1 hour
  });

  // 6. Return a success response
  return {
    status: 200,
    message: "Login successful",
  };
});
