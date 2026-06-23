// server/api/auth/register.post.ts

import { connectToDatabase } from "~~/server/config/mongodb";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { email, password, fullName, birthDate, gender } = body;

    if (!email || !password) {
        return {
            statusCode: 400,
            message: "Email and password are required.",
        };
    }

    const { db } = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
        return {
            statusCode: 409,
            message: "User already exists.",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        fullName,
        birthDate,
        gender,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        statusCode: 201,
        message: "User created successfully.",
        user: newUser,
    };
});
