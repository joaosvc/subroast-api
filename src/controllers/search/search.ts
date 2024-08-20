import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { SearchParams } from "./protocols";
import axios from "axios";

export class SearchController implements IController {
  async handle(
    httpRequest: HttpRequest<SearchParams>
  ): Promise<HttpResponse<any | string>> {
    try {
      const username = httpRequest?.params?.username
        ?.toString()
        .trim()
        .toLocaleLowerCase();

      if (!username) {
        return badRequest("Missing username");
      }

      const response = await axios.post(
        "https://github-roast.pages.dev/llama",
        {
          username: username,
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

      return ok<any>(response.data);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
