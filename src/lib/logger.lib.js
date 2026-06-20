import winston from "winston";

const { combine, timestamp, colorize, printf } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp: ts }) => `${ts} [${level}] ${message}`),
);

const prodFormat = combine(
  timestamp(),
  printf(({ level, message, timestamp: ts }) =>
    JSON.stringify({ ts, level, message }),
  ),
);

const transports = [new winston.transports.Console()];

if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: prodFormat,
    }),
  );
}

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports,
});
