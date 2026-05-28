import { prisma } from "../../lib/prisma";
import type { CreateNasabahInput, UpdateNasabahInput } from "./nasabah.schema";

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

export const nasabahService = {
    create: (data: CreateNasabahInput, userId: string) =>
        prisma.$transaction(async (tx) => {
            const nasabah = await tx.nasabah.create({ data: { ...data, userId } });
            await tx.auditLog.create({
                data: { action: "CREATE", entity: "Nasabah", entityId: nasabah.id, actorId: userId },
            });
            return nasabah;
        }),

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
