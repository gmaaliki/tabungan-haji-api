export interface EstimasiConfig {
    setoranAwal: bigint;
    masaTungguTahun: number;
}

export const DEFAULT_ESTIMASI_CONFIG: EstimasiConfig = {
    setoranAwal: BigInt(process.env.SETORAN_AWAL ?? "25000000"),
    masaTungguTahun: Number(process.env.MASA_TUNGGU_TAHUN) || 20,
};

export interface HasilEstimasi {
    eligible: boolean;
    saldo: string;
    setoranAwal: string;
    kurang: string;
    masaTungguTahun: number;
    tahunPerkiraan: number | null;
    keterangan: string;
}

export function hitungEstimasi(
    saldo: bigint,
    tahunSekarang: number,
    config: EstimasiConfig = DEFAULT_ESTIMASI_CONFIG,
    tanggalDaftarHaji?: Date | null,
): HasilEstimasi {
    if (saldo < config.setoranAwal) {
        return {
            eligible: false,
            saldo: saldo.toString(),
            setoranAwal: config.setoranAwal.toString(),
            kurang: (config.setoranAwal - saldo).toString(),
            masaTungguTahun: config.masaTungguTahun,
            tahunPerkiraan: null,
            keterangan: "Saldo belum mencapai setoran awal untuk memperoleh porsi haji",
        };
    }

    const tahunDaftar = tanggalDaftarHaji
        ? tanggalDaftarHaji.getUTCFullYear()
        : tahunSekarang;

    return {
        eligible: true,
        saldo: saldo.toString(),
        setoranAwal: config.setoranAwal.toString(),
        kurang: "0",
        masaTungguTahun: config.masaTungguTahun,
        tahunPerkiraan: tahunDaftar + config.masaTungguTahun,
        keterangan: "Estimasi tahun keberangkatan berdasarkan masa tunggu nasional",
    };
}
