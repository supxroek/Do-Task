import jwt from "jsonwebtoken";
import type { H3Event } from "h3";
import { prisma } from "./prisma";
import type { User } from "../../prisma/generated/prisma/client";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const ACCESS_TOKEN_MAX_AGE = 60 * 5;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_MAX_AGE * 1000;

type JwtPayload = {
  userId: string;
  email: string;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Utility: Get JWT secret
function getJwtSecret(name: "NUXT_JWT_SECRET" | "NUXT_REFRESH_JWT_SECRET") {
  const secret = process.env[name];

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: `${name} is not configured`,
    });
  }

  return secret;
}

// Utility: Convert user to public user (without password)
export function toPublicUser(user: User) {
  const { password, ...publicUser } = user;
  return publicUser;
}

// Utility: Sign JWT tokens
export function signAccessToken(user: Pick<User, "id" | "email">) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    getJwtSecret("NUXT_JWT_SECRET"),
    { expiresIn: "5m" },
  );
}

// Utility: Sign refresh token
export function signRefreshToken(user: Pick<User, "id" | "email">) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    getJwtSecret("NUXT_REFRESH_JWT_SECRET"),
    { expiresIn: "7d" },
  );
}

// Utility: Set access token cookie
export function setAccessTokenCookie(event: H3Event, accessToken: string) {
  setCookie(event, ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

// Utility: Set refresh token cookie
export function setRefreshTokenCookie(event: H3Event, refreshToken: string) {
  setCookie(event, REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

// Utility: Clear auth cookies
export function clearAuthCookies(event: H3Event) {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, cookieOptions);
  deleteCookie(event, REFRESH_TOKEN_COOKIE, cookieOptions);
}

// Utility: Create refresh token and store in DB
export async function createRefreshToken(user: Pick<User, "id" | "email">) {
  const refreshToken = signRefreshToken(user);

  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revoked: false },
    data: { revoked: true },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiration: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return refreshToken;
}

// Utility: Issue auth cookies (access + refresh)
export async function issueAuthCookies(event: H3Event, user: Pick<User, "id" | "email">) {
  const accessToken = signAccessToken(user);
  const refreshToken = await createRefreshToken(user);

  setAccessTokenCookie(event, accessToken);
  setRefreshTokenCookie(event, refreshToken);
}

// Utility: Get user by JWT payload
async function getUserByPayload(payload: JwtPayload) {
  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}

// Utility: Restore user session from refresh token
async function restoreFromRefreshToken(event: H3Event) {
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE);

  if (!refreshToken) {
    return null;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      getJwtSecret("NUXT_REFRESH_JWT_SECRET"),
    ) as JwtPayload;

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiration <= new Date()) {
      clearAuthCookies(event);
      return null;
    }

    const user = await getUserByPayload(payload);

    if (!user) {
      clearAuthCookies(event);
      return null;
    }

    setAccessTokenCookie(event, signAccessToken(user));
    return user;
  } catch {
    clearAuthCookies(event);
    return null;
  }
}

// Utility: Get authenticated user from request
export async function getAuthenticatedUser(event: H3Event) {
  const accessToken = getCookie(event, ACCESS_TOKEN_COOKIE);

  if (!accessToken) {
    return restoreFromRefreshToken(event);
  }

  try {
    const payload = jwt.verify(
      accessToken,
      getJwtSecret("NUXT_JWT_SECRET"),
    ) as JwtPayload;

    return getUserByPayload(payload);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return restoreFromRefreshToken(event);
    }

    clearAuthCookies(event);
    return null;
  }
}
