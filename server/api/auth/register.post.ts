// server/api/auth/register.post.ts

import { isValidDate, toISODate } from "~~/server/utils/date";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name, birthday, gender } = body;

  // 1. Validate
  if (!email || !password || !name || !birthday || !gender) {
    return {
      success: false,
      status: 400,
      message: "Missing required fields",
    };
  }

  if (!isValidDate(birthday)) {
    return {
      success: false,
      status: 400,
      message: "Invalid birthday format. Must be a valid date",
    };
  }

  if (!["male", "female", "other"].includes(gender)) {
    return {
      success: false,
      status: 400,
      message: "Invalid gender value. Must be 'male', 'female', or 'other'",
    };
  }

  // 2. Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      status: 400,
      message: "Email already exists",
    };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 4. Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      birthday: toISODate(birthday),
      gender,
    },
  });

  // 5. Return user (without password)
  const { password: _, ...userWithoutPassword } = user;
  return {
    success: true,
    status: 201,
    message: "Resgistration successful",
    user: userWithoutPassword,
  };
});
