import express from "express";
import serverRouter from "./router/server-router";
import { config } from "dotenv";

const main = async () => {
  config();

  const server = {
    app: express(),
    port: process.env.SERVER_PORT || 8000,
  };

  server.app.use(serverRouter);

  server.app.listen(server.port, async () =>
    console.log(`listening on port ${server.port}!`)
  );
};

main();
