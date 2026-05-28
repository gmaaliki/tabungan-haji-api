import { prisma } from "../../lib/prisma";
import type { UpdateStatusTabunganInput } from "./tabungan.schema";
import { hitungEstimasi } from "./estimasi";

function generateNomorRekening(): string {
    const digits = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(9, "0");
    return `7${digits}`;
}

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

export const tabunganService = {
    create: async (userId: string) => {
        const nasabah = await prisma.nasabah.findFirst({ where: { userId, deletedAt: null } });
        if (!nasabah) throw appError("NASABAH_NOT_REGISTERED", "Anda belum terdaftar sebagai nasabah");
        const existing = await prisma.tabunganHaji.count({ where: { nasabahId: nasabah.id } });
        if (existing > 0) throw appError("REKENING_EXISTS", "Nasabah sudah memiliki rekening tabungan haji");
        return prisma.tabunganHaji.create({
            data: { nasabahId: nasabah.id, nomorRekening: generateNomorRekening() },
            include: { nasabah: true },
        });
    },

    findAll: () => prisma.tabunganHaji.findMany({
        orderBy: { dibukaAt: "desc" },
        include: { nasabah: true },
    }),

    findById: (id: string) =>
        prisma.tabunganHaji.findUnique({
            where: { id },
            include: { nasabah: true },
        }),

    findByNasabah: (nasabahId: string) =>
        prisma.tabunganHaji.findMany({
            where: { nasabahId },
            omit: { nasabahId: true },
            orderBy: { dibukaAt: "desc" },
        }),

    estimasi: async (id: string) => {
        const tabungan = await prisma.tabunganHaji.findUnique({ where: { id } });
        if (!tabungan) throw appError("NOT_FOUND", "Rekening tabungan tidak ditemukan");
        return {
            nomorRekening: tabungan.nomorRekening,
            status: tabungan.status,
            ...hitungEstimasi(tabungan.saldo, new Date().getUTCFullYear()),
        };
    },

    updateStatus: async (id: string, data: UpdateStatusTabunganInput) => {
        const tabungan = await prisma.tabunganHaji.findUnique({ where: { id } });
        if (!tabungan) throw appError("NOT_FOUND", "Rekening tabungan tidak ditemukan");
        if (tabungan.status === "TUTUP") throw appError("ALREADY_CLOSED", "Rekening sudah ditutup");
        return prisma.tabunganHaji.update({ where: { id }, data });
    },

    delete: async (id: string) => {
        const tabungan = await prisma.tabunganHaji.findUnique({ where: { id } });
        if (!tabungan) throw appError("NOT_FOUND", "Rekening tabungan tidak ditemukan");
        if (tabungan.saldo > BigInt(0)) throw appError("HAS_SALDO", "Saldo harus 0 sebelum rekening dihapus");
        const transaksiCount = await prisma.transaksi.count({ where: { tabunganId: id } });
        if (transaksiCount > 0) throw appError("HAS_TRANSAKSI", "Rekening yang memiliki riwayat transaksi tidak dapat dihapus");
        return prisma.tabunganHaji.delete({ where: { id } });
    },
};
