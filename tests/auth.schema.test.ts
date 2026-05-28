import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "../src/modules/authentication/auth.schema";

describe("RegisterSchema", () => {
    it("menerima kredensial valid", () => {
        expect(RegisterSchema.safeParse({ email: "a@b.com", password: "password123" }).success).toBe(true);
    });

    it("menolak password kurang dari 8 karakter", () => {
        expect(RegisterSchema.safeParse({ email: "a@b.com", password: "short" }).success).toBe(false);
    });

    it("menolak email tidak valid", () => {
        expect(RegisterSchema.safeParse({ email: "bukan-email", password: "password123" }).success).toBe(false);
    });
});

describe("LoginSchema", () => {
    it("menolak password kosong", () => {
        expect(LoginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
    });
});
