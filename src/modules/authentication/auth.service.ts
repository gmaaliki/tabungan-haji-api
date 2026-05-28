import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import type { User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import type { RegisterInput, LoginInput } from "./auth.schema";

const SALT_ROUNDS = 10;
const EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN) || 60 * 60 * 24;

export interface AuthPayload {
    sub: string;
    email: string;
    role: string;
    jti: string;
    iat: number;
    exp: number;
}

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw appError("CONFIG_ERROR", "JWT_SECRET belum dikonfigurasi");
    return secret;
}

function sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
}

export const authService = {
    register: async (data: RegisterInput) => {
        const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
        const user = await prisma.user.create({ data: { email: data.email, password: hashed } });
        return sanitize(user);
    },

    login: async (data: LoginInput) => {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw appError("INVALID_CREDENTIALS", "Email atau password salah");

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) throw appError("INVALID_CREDENTIALS", "Email atau password salah");

        const jti = randomUUID();
        const token = jwt.sign({ sub: user.id, email: user.email, role: user.role, jti }, getSecret(), {
            expiresIn: EXPIRES_IN_SECONDS,
        });

        return { token, expiresIn: EXPIRES_IN_SECONDS, user: sanitize(user) };
    },

    logout: async (payload: AuthPayload) => {
        try {
            await prisma.revokedToken.create({
                data: { jti: payload.jti, expiresAt: new Date(payload.exp * 1000) },
            });
        } catch (err: any) {
            if (err.code === "P2002") return; // token sudah dicabut, logout idempoten
            throw err;
        }
    },

    verifyToken: (token: string): AuthPayload => jwt.verify(token, getSecret()) as unknown as AuthPayload,

    isTokenRevoked: async (jti: string) =>
        (await prisma.revokedToken.count({ where: { jti } })) > 0,
};
