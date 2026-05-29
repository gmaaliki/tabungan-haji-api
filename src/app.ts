import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./modules/authentication/auth.route";
import { requireAuth } from "./modules/authentication/auth.middleware";
import { nasabahRoutes } from "./modules/nasabah/nasabah.route";
import { tabunganRoutes } from "./modules/tabungan/tabungan.route";
import { transaksiRoutes } from "./modules/transaksi/transaksi.route";
import { laporanRoutes } from "./modules/laporan/laporan.route";

// BigInt serialization support
(BigInt.prototype as any).toJSON = function () { return this.toString(); };

export const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://tabungan-haji-web.vercel.app"]
    : ["http://localhost:3001"];

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, Postman) that send no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} tidak diizinkan oleh CORS`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "tabungan-haji-api",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/nasabah', nasabahRoutes);
app.use('/api/v1/tabungan-haji', requireAuth, tabunganRoutes);
app.use('/api/v1/tabungan-haji', requireAuth, transaksiRoutes);
app.use('/api/v1/laporan', requireAuth, laporanRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal' });
});