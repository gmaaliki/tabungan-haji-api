import { prisma } from "../../lib/prisma";

function generateReferensi(jenis: "SETORAN" | "PENARIKAN"): string {
    const prefix = jenis === "SETORAN" ? "STR" : "PTR";
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${prefix}${Date.now()}${rand}`;
}

function appError(code: string, message: string): Error {
    const err = new Error(message) as any;
    err.code = code;
    return err;
}

export const transaksiService = {
    setoran: async (tabunganId: string, nominal: number, metode?: string) => {
        return prisma.$transaction(async (tx) => {
            const tabungan = await tx.tabunganHaji.findUnique({ where: { id: tabunganId } });
            if (!tabungan) throw appError("TABUNGAN_NOT_FOUND", "Rekening tabungan tidak ditemukan");
            if (tabungan.status !== "AKTIF") throw appError("TABUNGAN_NOT_ACTIVE", "Rekening tidak aktif");

            const nominalBig = BigInt(nominal);
            const saldoSebelum = tabungan.saldo;
            const saldoSesudah = saldoSebelum + nominalBig;

            const [tabunganUpdated, transaksi] = await Promise.all([
                tx.tabunganHaji.update({ where: { id: tabunganId }, data: { saldo: saldoSesudah } }),
                tx.transaksi.create({
                    data: {
                        tabunganId,
                        jenis: "SETORAN",
                        nominal: nominalBig,
                        saldoSebelum,
                        saldoSesudah,
                        referensi: generateReferensi("SETORAN"),
                        metode: metode ?? null,
                    },
                }),
            ]);

            return { tabungan: tabunganUpdated, transaksi };
        });
    },

    penarikan: async (tabunganId: string, nominal: number, metode?: string) => {
        return prisma.$transaction(async (tx) => {
            const tabungan = await tx.tabunganHaji.findUnique({ where: { id: tabunganId } });
            if (!tabungan) throw appError("TABUNGAN_NOT_FOUND", "Rekening tabungan tidak ditemukan");
            if (tabungan.status !== "AKTIF") throw appError("TABUNGAN_NOT_ACTIVE", "Rekening tidak aktif");

            const nominalBig = BigInt(nominal);
            if (tabungan.saldo < nominalBig) throw appError("INSUFFICIENT_BALANCE", "Saldo tidak mencukupi");

            const saldoSebelum = tabungan.saldo;
            const saldoSesudah = saldoSebelum - nominalBig;

            const [tabunganUpdated, transaksi] = await Promise.all([
                tx.tabunganHaji.update({ where: { id: tabunganId }, data: { saldo: saldoSesudah } }),
                tx.transaksi.create({
                    data: {
                        tabunganId,
                        jenis: "PENARIKAN",
                        nominal: nominalBig,
                        saldoSebelum,
                        saldoSesudah,
                        referensi: generateReferensi("PENARIKAN"),
                        metode: metode ?? null,
                    },
                }),
            ]);

            return { tabungan: tabunganUpdated, transaksi };
        });
    },

    findByTabungan: (tabunganId: string) =>
        prisma.transaksi.findMany({ where: { tabunganId }, orderBy: { waktu: "desc" } }),

    findById: (id: string) => prisma.transaksi.findUnique({ where: { id } }),
};
