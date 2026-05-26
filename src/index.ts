import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { nasabahRoutes } from "./modules/nasabah/nasabah.route";
import { tabunganRoutes } from "./modules/tabungan/tabungan.route";
import { transaksiRoutes } from "./modules/transaksi/transaksi.route";

// BigInt serialization support
(BigInt.prototype as any).toJSON = function () { return this.toString(); };

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "tabungan-haji-api",
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/nasabah', nasabahRoutes);
app.use('/api/v1/tabungan', tabunganRoutes);
app.use('/api/v1/tabungan', transaksiRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal' });
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
