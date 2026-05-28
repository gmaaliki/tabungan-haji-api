import { z } from "zod";

export const LaporanQuerySchema = z.object({
  tahun: z.coerce.number().int().min(2000, "Tahun tidak valid").max(9999, "Tahun tidak valid").optional(),
  bulan: z.coerce.number().int().min(1, "Bulan harus 1-12").max(12, "Bulan harus 1-12").optional(),
});

export type LaporanQueryInput = z.infer<typeof LaporanQuerySchema>;
