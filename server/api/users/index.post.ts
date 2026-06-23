// server/api/users/index.post.ts (POST new user)

import { connectToDatabase } from "~~/server/config/mongodb";

export default defineEventHandler(async (event) => {
  const { db } = await connectToDatabase();
  const userData = await readBody(event);

  try {
    const result = await db.collection("users").insertOne(userData);
    return {
      statusCode: 201,
      user: { ...userData, _id: result.insertedId },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error creating user",
    };
  }
});
