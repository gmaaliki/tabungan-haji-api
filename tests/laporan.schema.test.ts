import { describe, it, expect } from "vitest";
import { LaporanQuerySchema } from "../src/modules/laporan/laporan.schema";

describe("LaporanQuerySchema", () => {
    it("mengubah string query menjadi number", () => {
        const parsed = LaporanQuerySchema.safeParse({ tahun: "2026", bulan: "5" });
        expect(parsed.success).toBe(true);
        if (parsed.success) {
            expect(parsed.data.tahun).toBe(2026);
            expect(parsed.data.bulan).toBe(5);
        }
    });

    it("menolak bulan di luar 1-12", () => {
        expect(LaporanQuerySchema.safeParse({ bulan: "13" }).success).toBe(false);
    });

    it("mengizinkan query kosong (default ditangani controller)", () => {
        expect(LaporanQuerySchema.safeParse({}).success).toBe(true);
    });
});
