import { z } from "zod";

export const UpdateStatusTabunganSchema = z.object({
    status: z.enum(["AKTIF", "DORMANT", "TUTUP"]),
});

export type UpdateStatusTabunganInput = z.infer<typeof UpdateStatusTabunganSchema>;
