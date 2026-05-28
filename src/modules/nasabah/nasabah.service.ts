import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import type { CreateNasabahInput, UpdateNasabahInput } from "./nasabah.schema";

const SALT_ROUNDS = 10;

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

export const nasabahService = {
    create: async (data: CreateNasabahInput) => {
        const { password, ...nasabahData } = data;
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data: { email: nasabahData.email, password: hashed } });
            const nasabah = await tx.nasabah.create({ data: { ...nasabahData, userId: user.id } });
            await tx.auditLog.create({
                data: { action: "CREATE", entity: "Nasabah", entityId: nasabah.id, actorId: user.id },
            });
            return nasabah;
        });
    },

    findAll: () => prisma.nasabah.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),

    findById: (id: string) =>
        prisma.nasabah.findFirst({
            where: { id, deletedAt: null },
            include: { tabungan: { orderBy: { dibukaAt: "desc" } } },
        }),

    update: async (id: string, data: UpdateNasabahInput) => {
        if (Object.keys(data).length === 0) throw appError("EMPTY_UPDATE", "Minimal satu field harus diisi");
        const existing = await prisma.nasabah.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw appError("NOT_FOUND", "Nasabah tidak ditemukan");
        return prisma.nasabah.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        const existing = await prisma.nasabah.findFirst({ where: { id, deletedAt: null } });
        if (!existing) throw appError("NOT_FOUND", "Nasabah tidak ditemukan");
        return prisma.nasabah.update({ where: { id }, data: { deletedAt: new Date() } });
    },
};
