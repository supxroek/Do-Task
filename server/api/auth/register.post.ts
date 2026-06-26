// server/api/auth/register.post.ts

import { isValidDate, toISODate } from "~~/server/utils/date";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name, birthday, gender } = body;

  // 1. Validate the input data
  if (!email || !password) {
    throw createError({
      status: 400,
      message: "Email and password are required",
    });
  }

  // 2. Validate the birthday
  if (!isValidDate(birthday)) {
    throw createError({
      status: 400,
      message: "Invalid birthday format.",
    });
  }

  // 3. Validate the gender[male, female, other]
  if (!["male", "female", "other"].includes(gender)) {
    throw createError({
      status: 400,
      message: "Invalid gender value. Must be 'male', 'female', or 'other'",
    });
  }

  // 4. Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      status: 400,
      message: "User already exists",
    });
  }

  // 5. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 6. Create a new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      birthday: toISODate(birthday),
      gender,
    },
  });

  // 7. Return the newly created user (excluding the password)
  const { password: _, ...safeData } = newUser;

  // 8. Return a success response
  return {
    status: 201,
    message: "The user has successfully registered.",
    user: safeData,
  };
});
