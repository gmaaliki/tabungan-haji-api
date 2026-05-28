import { describe, it, expect } from "vitest";
import { CreateNasabahSchema, UpdateNasabahSchema } from "../src/modules/nasabah/nasabah.schema";

const valid = { nik: "3201234567890001", nama: "Ahmad Fauzi", email: "ahmad@email.com", nomorHp: "081234567890", password: "rahasia123" };

describe("CreateNasabahSchema", () => {
    it("menerima data valid", () => {
        expect(CreateNasabahSchema.safeParse(valid).success).toBe(true);
    });

    it("menolak NIK bukan 16 digit", () => {
        expect(CreateNasabahSchema.safeParse({ ...valid, nik: "123" }).success).toBe(false);
    });

    it("menolak email tidak valid", () => {
        expect(CreateNasabahSchema.safeParse({ ...valid, email: "bukan-email" }).success).toBe(false);
    });

    it("menolak format nomor HP salah", () => {
        expect(CreateNasabahSchema.safeParse({ ...valid, nomorHp: "12345" }).success).toBe(false);
    });

    it("menolak password kurang dari 8 karakter", () => {
        expect(CreateNasabahSchema.safeParse({ ...valid, password: "pendek" }).success).toBe(false);
    });

    it("menolak tanpa password", () => {
        const { password, ...tanpaPassword } = valid;
        expect(CreateNasabahSchema.safeParse(tanpaPassword).success).toBe(false);
    });

    it("tidak meneruskan userId dari client (anti privilege escalation)", () => {
        const parsed = CreateNasabahSchema.safeParse({ ...valid, userId: "tebak-tebakan" });
        expect(parsed.success).toBe(true);
        if (parsed.success) expect((parsed.data as Record<string, unknown>).userId).toBeUndefined();
    });

    it("tidak meneruskan role dari client (anti privilege escalation)", () => {
        const parsed = CreateNasabahSchema.safeParse({ ...valid, role: "ADMIN" });
        expect(parsed.success).toBe(true);
        if (parsed.success) expect((parsed.data as Record<string, unknown>).role).toBeUndefined();
    });
});

describe("UpdateNasabahSchema", () => {
    it("menerima update sebagian", () => {
        expect(UpdateNasabahSchema.safeParse({ nama: "Budi Santoso" }).success).toBe(true);
    });

    it("menolak nama terlalu pendek", () => {
        expect(UpdateNasabahSchema.safeParse({ nama: "ab" }).success).toBe(false);
    });
});
