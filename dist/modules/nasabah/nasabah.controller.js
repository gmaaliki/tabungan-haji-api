"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nasabahController = void 0;
const nasabah_schema_1 = require("./nasabah.schema");
const nasabah_service_1 = require("./nasabah.service");
exports.nasabahController = {
    async create(req, res) {
        const parsed = nasabah_schema_1.CreateNasabahSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "VALIDATION_ERR",
                details: parsed.error.flatten()
            });
        }
        try {
            const nasabah = await nasabah_service_1.nasabahService.create(parsed.data);
        }
        catch (err) {
            if (
            // err instanceof Prisma.PrismaClientKnownRequestError &&  
            err.code === "P2002") {
                const field = err.meta?.target?.[0] ?? "field";
                return res.status(409).json({
                    error: "DUPLICATE_ENTRY",
                    message: `${field} sudah terdaftar`,
                });
            }
            throw err;
        }
        return res.status(201).json({
            data: parsed.data,
            message: 'Halo'
        });
    },
    async findAll(req, res) {
        const data = await nasabah_service_1.nasabahService.findAll();
        return res.status(200).json({
            data,
            total: data.length,
            message: 'OK'
        });
    },
    async findById(req, res) {
        return res.status(200).json({
            message: 'OK'
        });
    },
};
