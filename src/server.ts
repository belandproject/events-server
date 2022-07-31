require("dotenv").config();
import express from "express";
import { apiRouter } from "./api";
import { PORT } from "./constants";
import { initCronJob } from "./libs/job";
import { errorMiddleware } from "./middlewares/error";
import { sequelize } from "./sequelize";

// Create our main app
const app = express().disable("x-powered-by");

// For body requests
app.use(express.urlencoded({ extended: false }));
app.use(
  express.json({
    type: ["application/json", "application/*+json"],
    limit: "500kb",
  })
);

app.use("/v1", apiRouter);
app.use(errorMiddleware);

function initApp() {
  app.listen(PORT, () => {
    console.log(`Event Service listening on port ${PORT}`);
  });
}

export async function start() {
  await sequelize.sync({ force: false });
  initCronJob();
  initApp();
}

start();
