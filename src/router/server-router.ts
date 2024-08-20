import express from "express";
import cors, { CorsOptions } from "cors";
import OpenAI from "openai";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { SearchController } from "../controllers/search/search";
import { RoastController } from "../controllers/roast/roast";

const serverRouter: Router = Router();
const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET",
  optionsSuccessStatus: 204,
};
const prisma = new PrismaClient();
const clientOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

serverRouter.use(["/search", "/roast"], cors(corsOptions), express.json());

serverRouter.get("/search", async (req, res) => {
  const searchController = new SearchController();

  const { body, statusCode } = await searchController.handle({
    body: req.body,
    params: req.query,
  });

  res.status(statusCode).send(body);
});

serverRouter.get("/roast", async (req, res) => {
  const roastController = new RoastController();

  const { body, statusCode } = await roastController.handle(
    {
      body: req.body,
      params: req.query,
    },
    req,
    res,
    prisma,
    clientOpenAI
  );

  res.status(statusCode).send(body);
});

export default serverRouter;
