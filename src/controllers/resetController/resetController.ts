import { Request, Response } from "express";
import { resetService } from "../../services/resetService";
import { handleError } from "../../utils/handleError";

export const resetController = {
  reset: (req: Request, res: Response) => {
    const response = resetService.index();

    if (response) {
      res.status(200).send("OK");
    } else {
      handleError(res);
    }
  },
};
