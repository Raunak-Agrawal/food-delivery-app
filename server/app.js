import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cors from "cors";

import { userRouter } from "./routes/user.js";
import { restaurantRouter } from "./routes/restaurant.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { NotFoundError } from "./errors/not-found-error.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(userRouter);
app.use(restaurantRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
