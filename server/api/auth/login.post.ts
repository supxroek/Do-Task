// server/api/auth/login.post.ts

import { connectToDatabase } from "~~/server/utils/mongodb";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    return {
      statusCode: 400,
      message: "Email and password are required.",
    };
  }

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return {
      statusCode: 401,
      message: "Invalid email or password.",
    };
  }

  // Here you would typically verify the password
  // For now, we'll assume the password is correct
  if (user.password !== password) {
    return {
      statusCode: 401,
      message: "Invalid email or password.",
    };
  }

  // Generate a JWT token or any other authentication token here
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return {
    success: true,
    message: "Login successful",
    token,
  };
});
