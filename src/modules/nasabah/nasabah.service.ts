import { prisma } from "../../lib/prisma";
import type { CreateNasabahInput, UpdateNasabahInput } from "./nasabah.schema";

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

export const nasabahService = {
    create: (data: CreateNasabahInput) => prisma.nasabah.create({ data }),

    findAll: () => prisma.nasabah.findMany({ orderBy: { createdAt: "desc" } }),

    findById: (id: string) =>
        prisma.nasabah.findUnique({
            where: { id },
            include: { tabungan: { orderBy: { dibukaAt: "desc" } } },
        }),

    update: async (id: string, data: UpdateNasabahInput) => {
        if (Object.keys(data).length === 0) throw appError("EMPTY_UPDATE", "Minimal satu field harus diisi");
        return prisma.nasabah.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        const tabunganCount = await prisma.tabunganHaji.count({ where: { nasabahId: id } });
        if (tabunganCount > 0) throw appError("HAS_TABUNGAN", "Nasabah masih memiliki rekening tabungan");
        return prisma.nasabah.delete({ where: { id } });
    },
};
