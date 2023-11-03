import { Response } from "express";

export const handleError = (res: Response, message?: string) => {
  res
    .status(404)
    .send(message ?? "Tivemos um problema com a requisição, tente novamente.");
};
