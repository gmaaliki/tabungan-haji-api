import { describe, it, expect } from "vitest";
import { hitungEstimasi, type EstimasiConfig } from "../src/modules/tabungan/estimasi";

const config: EstimasiConfig = { setoranAwal: 25000000n, masaTungguTahun: 20 };

describe("hitungEstimasi", () => {
    it("belum eligible saat saldo di bawah setoran awal", () => {
        const r = hitungEstimasi(10000000n, 2026, config);
        expect(r.eligible).toBe(false);
        expect(r.kurang).toBe("15000000");
        expect(r.tahunPerkiraan).toBeNull();
    });

    it("eligible tepat saat saldo mencapai setoran awal", () => {
        const r = hitungEstimasi(25000000n, 2026, config);
        expect(r.eligible).toBe(true);
        expect(r.kurang).toBe("0");
        expect(r.tahunPerkiraan).toBe(2046);
    });

    it("eligible saat saldo melebihi setoran awal", () => {
        const r = hitungEstimasi(50000000n, 2026, config);
        expect(r.eligible).toBe(true);
        expect(r.tahunPerkiraan).toBe(2046);
    });
});
