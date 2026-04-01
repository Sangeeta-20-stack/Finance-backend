import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";

export const securityMiddleware = (app) => {
  app.use(helmet());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(compression());
};