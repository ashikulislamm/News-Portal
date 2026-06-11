const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const getLevel = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta && Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : "";
  
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(meta && typeof meta === "object" ? meta : { meta }),
    });
  }

  // Development output format
  const colorMap = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    debug: "\x1b[35m", // Magenta
  };
  const resetColor = "\x1b[0m";
  const color = colorMap[level] || resetColor;

  return `[${timestamp}] ${color}${level.toUpperCase()}${resetColor}: ${message}${metaString}`;
};

const log = (level, message, meta) => {
  if (levels[level] <= levels[getLevel()]) {
    const formatted = formatMessage(level, message, meta);
    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }
};

export const logger = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
  debug: (message, meta) => log("debug", message, meta),
};

export default logger;
