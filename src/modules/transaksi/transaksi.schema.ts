import { z } from "zod";

export const SetoranSchema = z.object({
    nominal: z.number().int("Nominal harus bilangan bulat").min(100000, "Minimum setoran Rp100.000"),
    metode: z.string().max(20).optional(),
});

export const PenarikanSchema = z.object({
    nominal: z.number().int("Nominal harus bilangan bulat").positive("Nominal harus lebih dari 0"),
    metode: z.string().max(20).optional(),
});

export type SetoranInput = z.infer<typeof SetoranSchema>;
export type PenarikanInput = z.infer<typeof PenarikanSchema>;
