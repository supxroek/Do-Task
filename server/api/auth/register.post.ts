// server/api/auth/register.post.ts

import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name, birthday, gender } = body;

  // existing user check
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  // create new user
  const newUser = await prisma.users.create({
    data: {
      email,
      password,
      name,
      birthday: birthday ? new Date(birthday) : null,
      gender,
    },
  });

  // return the new user without the password
  const { password: _, ...safedata } = newUser;

  return {
    statusCode: 201,
    statusMessage: "User created successfully",
    data: safedata,
  };
});
