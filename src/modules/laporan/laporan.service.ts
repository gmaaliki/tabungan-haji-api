import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const HEADERS = [
    "waktu",
    "nomor_rekening",
    "nama_nasabah",
    "nik",
    "jenis",
    "nominal",
    "saldo_sebelum",
    "saldo_sesudah",
    "metode",
    "referensi",
];

function csvCell(value: string): string {
    return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function buildCsv(headers: string[], rows: string[][]): string {
    const lines = [headers.map(csvCell).join(",")];
    for (const row of rows) lines.push(row.map(csvCell).join(","));
    return lines.join("\r\n");
}

function monthRange(tahun: number, bulan: number) {
    return {
        start: new Date(Date.UTC(tahun, bulan - 1, 1)),
        end: new Date(Date.UTC(tahun, bulan, 1)),
    };
}

export const laporanService = {
    transaksiBulananCsv: async (tahun: number, bulan: number, tabunganId?: string) => {
        const { start, end } = monthRange(tahun, bulan);

        const where: Prisma.TransaksiWhereInput = { waktu: { gte: start, lt: end } };
        if (tabunganId) where.tabunganId = tabunganId;

        const transaksi = await prisma.transaksi.findMany({
            where,
            include: { tabungan: { include: { nasabah: true } } },
            orderBy: { waktu: "asc" },
        });

        const rows = transaksi.map((t) => [
            t.waktu.toISOString(),
            t.tabungan.nomorRekening,
            t.tabungan.nasabah.nama,
            t.tabungan.nasabah.nik,
            t.jenis,
            t.nominal.toString(),
            t.saldoSebelum.toString(),
            t.saldoSesudah.toString(),
            t.metode ?? "",
            t.referensi,
        ]);

        return buildCsv(HEADERS, rows);
    },
};
