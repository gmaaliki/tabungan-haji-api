import { z } from "zod";

export const UpdateStatusTabunganSchema = z.object({
    status: z.enum(["AKTIF", "DORMANT", "TUTUP"]),
});

export type UpdateStatusTabunganInput = z.infer<typeof UpdateStatusTabunganSchema>;

export const UpdateTanggalDaftarHajiSchema = z.object({
    tanggalDaftarHaji: z.coerce.date(),
});

export type UpdateTanggalDaftarHajiInput = z.infer<typeof UpdateTanggalDaftarHajiSchema>;
