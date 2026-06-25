// server/api/auth/register.post.ts

import { isValidDate, toISODate } from "~~/server/utils/date";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name, birthday, gender } = body;

  // Validate the input data
  if (!email || !password) {
    return {
      status: 400,
      message: "Email and password are required",
    };
  }

  if (!isValidDate(birthday)) {
    return {
      status: 400,
      message: "Invalid birthday format",
    };
  }

  if (!["male", "female", "other"].includes(gender)) {
    return {
      status: 400,
      message: "Invalid gender value. Must be 'male', 'female', or 'other'",
    };
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      status: 400,
      message: "User already exists",
    };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      birthday: toISODate(birthday),
      gender,
    },
  });

  // Return the newly created user (excluding the password)
  const { password: _, ...safeData } = newUser;

  return {
    status: 201,
    message: "User registered successfully",
    user: safeData,
  };
});
