import { HttpResponse, HttpStatusCode } from "./protocols";

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  body,
});

export const badRequest = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.BAD_REQUEST,
    body: message,
  };
};

export const unauthorized = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    body: message,
  };
};

export const serverError = (message?: string): HttpResponse<string> => {
  return {
    statusCode: HttpStatusCode.SERVER_ERROR,
    body: `Something went wrong${message ? `: ${message}` : ""}`,
  };
};
