import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 10;

async function main() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi di .env untuk seed admin");
    }
    if (password.length < 8) {
        throw new Error("ADMIN_PASSWORD minimal 8 karakter");
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await prisma.user.upsert({
        where: { email },
        create: { email, password: hashed, role: "ADMIN" },
        update: { password: hashed, role: "ADMIN" },
    });

    console.log(`Admin siap: ${admin.email} (role=${admin.role})`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
