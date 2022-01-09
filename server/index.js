import mongoose from "mongoose";

import { app } from "./app.js";

const PORT = process.env.PORT || 8080;

const start = async () => {
  console.log("Starting up........");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
  });
};

start();
