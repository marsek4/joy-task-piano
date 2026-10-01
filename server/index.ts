import express, { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const FLAG = process.env.FLAG;
const RIGHT_COMBINATION = process.env.RIGHT_COMBINATION;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

if (!FLAG || !RIGHT_COMBINATION) {
  throw new Error("FLAG и RIGHT_COMBINATION должны быть заданы в .env");
}

// CORS: разрешаем только фронт
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

// Парсим JSON body
app.use(express.json({ limit: "10kb" }));

// Rate-limit: не больше 20 попыток за 10 минут с одного IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many attempts, try later" },
});

// Простой healthcheck (удобно для Render/Railway)
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "piano-joy-server" });
});

// Единственный рабочий эндпоинт
app.post("/api/check", limiter, (req: Request, res: Response) => {
  const { combination } = req.body ?? {};

  // Валидация входа
  if (typeof combination !== "string") {
    return res.status(400).json({ success: false, error: "Invalid request" });
  }

  if (combination.length > 64) {
    return res.status(400).json({ success: false, error: "Too long" });
  }

  // Небольшая задержка — защита от мгновенного брутфорса
  const delay = 300 + Math.floor(Math.random() * 200);

  setTimeout(() => {
    // Нормализуем: убираем пробелы и приводим к нижнему регистру
    const normalized = combination.trim().toLowerCase();

    if (normalized === RIGHT_COMBINATION) {
      return res.json({ success: true, flag: FLAG });
    }

    return res.status(403).json({ success: false, error: "Wrong combination" });
  }, delay);
});

// 404 для всего остального
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
