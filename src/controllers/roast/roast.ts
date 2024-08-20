import express from "express";
import { PrismaClient } from "@prisma/client";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { RoastParams } from "./protocols";
import OpenAI from "openai";
import GithubRepo from "../../github/github-repo";

export class RoastController implements IController {
  async handle(
    httpRequest: HttpRequest<RoastParams>,
    request: express.Request,
    response: express.Response,
    prisma: PrismaClient,
    clientOpenAI: OpenAI
  ): Promise<HttpResponse<any | string>> {
    try {
      const username = httpRequest?.params?.username
        ?.toString()
        .trim()
        .toLocaleLowerCase();

      if (!username) {
        return badRequest("Missing username");
      }

      const history = await prisma.roast.findFirst({
        where: {
          username: username,
          language: "portuguese",
        },
      });

      if (history) {
        return ok<any>({ roast: history.response, username });
      }

      const githubData = await GithubRepo.getData(username);
      const prompt = `faça uma crítica curta e dura para o seguinte perfil do github: ${username}. Aqui estão os detalhes: "${JSON.stringify(githubData)}"`;

      const completion = await clientOpenAI.chat.completions.create({
        model: "gpt-4o-mini",
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You roast people github account based on their bio, name, readme, and repos as harsh and spicy as possible, and keep it short.",
          },
          { role: "user", content: prompt },
        ],
      });

      const roast = completion.choices[0].message.content!;
      const country = String(request.headers["x-vercel-ip-country"] || "");

      await prisma.roast.create({
        data: {
          username: username,
          response: roast,
          country: country,
          language: "portuguese",
        },
      });

      return ok<any>({ roast, username });
    } catch (error) {
      if (error instanceof Error) {
        return serverError(error.message);
      }
      return serverError();
    }
  }
}
