// server/api/users/[id].get.ts (GET user by ID)

import { connectToDatabase } from "~~/server/config/mongodb";

export default defineEventHandler(async (event) => {
  const { db } = await connectToDatabase();
  const userId = getRouterParam(event, "id");

  try {
    const user = await db.collection("users").findOne({ _id: userId } as any);
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }

    return {
      statusCode: 200,
      user: user,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching user",
    };
  }
});
