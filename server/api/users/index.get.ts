// server/api/users/index.get.ts (GET all users)

import { connectToDatabase } from "~~/server/config/mongodb";

export default defineEventHandler(async () => {
  const { db } = await connectToDatabase();
  const users = await db.collection("users").find({}).toArray();

  return {
    statusCode: 200,
    users: users,
  };
});
