import express from "express";
import cors, { CorsOptions } from "cors";
import { Router } from "express";
import axios from "axios";

const serverRouter: Router = Router();
const corsOptions: CorsOptions = {
  origin: "*",
  methods: "GET",
  optionsSuccessStatus: 204,
};

serverRouter.use("/search", cors(corsOptions), express.json());

serverRouter.get("/search", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    res.status(400).send({ message: "Missing username" });
    return;
  }

  const trimmedUsername = username.toString().trim().toLocaleLowerCase();

  try {
    const response = await axios.post(
      "https://github-roast.pages.dev/llama",
      {
        username: trimmedUsername,
        language: "portuguese",
      },
      {
        headers: {
          Host: "github-roast.pages.dev",
          Cookie:
            "_clck=1idaquz%7C2%7Cfoh%7C0%7C1682; _clsk=1iqukhi%7C1724117408921%7C7%7C1%7Cr.clarity.ms%2Fcollect",
          "sec-ch-ua":
            '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
          "content-type": "application/json",
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          "sec-ch-ua-platform": '"Windows"',
          accept: "*/*",
          origin: "https://github-roast.pages.dev",
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: "https://github-roast.pages.dev/",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          priority: "u=1, i",
        },
      }
    );

    res.status(200).send(response.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    } else {
      res.status(500).send({ message: "Something went wrong" });
    }
  }
});
export default serverRouter;
