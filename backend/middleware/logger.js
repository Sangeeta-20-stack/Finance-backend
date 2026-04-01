import morgan from "morgan";

// simple log format
export const logger = morgan("dev");

// optional: file logging
export const fileLogger = morgan("combined");