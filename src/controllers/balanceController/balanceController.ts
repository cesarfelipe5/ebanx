import { Request, Response } from "express";
import { balanceService } from "../../services/balanceService";
import { operationHandlers } from "../../utils/balance";
import { handleError } from "../../utils/handleError";

export const balanceController = {
  getBalance: (req: Request, res: Response) => {
    const { account_id } = req.query;
    const file = balanceService.getFile();

    let balance = 0;

    if (file) {
      const accountByAccountId = file.filter(
        (item) => Number(item.id) === Number(account_id),
      );

      if (accountByAccountId.length) {
        for (const item of accountByAccountId) {
          balance = operationHandlers[item.type](balance, item.amount);
        }

        res.status(200).send(String(balance));
      } else {
        res.status(404).send("0");
      }
    } else {
      handleError(res);
    }
  },
};
