import { describe, it, expect } from "vitest";
import { SetoranSchema } from "../src/modules/transaksi/transaksi.schema";

describe("SetoranSchema", () => {
    it("menolak nominal di bawah minimum Rp100.000", () => {
        expect(SetoranSchema.safeParse({ nominal: 99999 }).success).toBe(false);
    });

    it("menerima nominal tepat Rp100.000", () => {
        expect(SetoranSchema.safeParse({ nominal: 100000 }).success).toBe(true);
    });

    it("menolak nominal negatif", () => {
        expect(SetoranSchema.safeParse({ nominal: -100000 }).success).toBe(false);
    });

    it("menolak nominal bukan bilangan bulat", () => {
        expect(SetoranSchema.safeParse({ nominal: 150000.5 }).success).toBe(false);
    });

    it("menerima metode opsional", () => {
        expect(SetoranSchema.safeParse({ nominal: 250000, metode: "QRIS" }).success).toBe(true);
    });
});
