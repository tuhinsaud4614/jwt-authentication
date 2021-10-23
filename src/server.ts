import { config } from "dotenv";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import { connect } from "mongoose";
import path from "path";
import logger from "./logger";
import { HttpError } from "./models/utility.model";
import router from "./routes";
import { IErrorResponse } from "./utility";

config({ path: path.join(__dirname, "..", "/.env") });
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "..", "/public")));
app.use(json());
app.use(urlencoded({ extended: false }));

// Routes
app.use("/api/v1", router);

// No route found
app.use((_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError("Could not found this route!!!", 404);
  next(error);
});

// Error handle middleware
app.use((err: HttpError, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    logger.warn("Header already sent");
    return next(err);
  }
  logger.error(err.message);
  res.status(err.code).json({
    ...err.toObject(),
  } as IErrorResponse);
});

connect(process.env.MONGO_DB_URI || "mongodb://localhost:27017/jwt-authentication")
  .then(() => {
    logger.info(`Database connected successfully!!!`);
    app.listen(PORT, () => {
        logger.info(`The application running on http://${HOST}:${PORT}`);
    });
  })
  .catch((er) => {
    logger.error(`Database connection failed and err is: ${er}`);
  });