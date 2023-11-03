import { Request, Response } from "express";
import { eventService } from "../../services/eventService";
import { operationHandlers } from "../../utils/balance";
import { Account, AccountType } from "../../utils/file/file.types";
import { handleError } from "../../utils/handleError";

interface RecordAccountMovementProps {
  file: Account[];
  amount: number;
  id: number;
  type: AccountType;
}

interface DepositProps {
  file: Account[];
  amount: number;
  destination: number;
  res: Response;
}

interface WithdrawProps {
  file: Account[];
  amount: number;
  origin: number;
  res: Response;
}

interface TransferProps {
  file: Account[];
  amount: number;
  destination: number;
  origin: number;
  res: Response;
}

interface GetBalanceProps {
  accountToBalance: Account[];
}
const recordAccountMovement = ({
  file,
  amount,
  id,
  type,
}: RecordAccountMovementProps) => {
  file.push({
    amount,
    id,
    type,
  });

  eventService.setFile(file);

  return file;
};

const getBalance = ({ accountToBalance }: GetBalanceProps) => {
  let balance = 0;

  for (const item of accountToBalance) {
    balance = operationHandlers[item.type](balance, item.amount);
  }

  return balance;
};

const deposit = ({ file, destination, amount, res }: DepositProps) => {
  let balance = 0;

  const newFile = recordAccountMovement({
    file,
    amount,
    id: destination,
    type: "deposit",
  });

  const accountByDestination = newFile.filter(
    (item) => Number(item.id) === Number(destination),
  );

  if (accountByDestination.length) {
    balance = getBalance({ accountToBalance: accountByDestination });

    return res
      .status(201)
      .send({ destination: { id: destination, balance: balance } });
  }

  return res
    .status(201)
    .send({ destination: { id: destination, balance: balance } });
};

const withdraw = ({ amount, file, origin, res }: WithdrawProps) => {
  let balance = 0;

  const hasAccountOrigin = file.some(
    (item) => Number(item.id) === Number(origin),
  );

  if (!hasAccountOrigin) {
    return res.status(404).send("0");
  }

  const newFile = recordAccountMovement({
    amount,
    file,
    id: origin,
    type: "withdraw",
  });

  const accountByOrigin = newFile.filter(
    (item) => Number(item.id) === Number(origin),
  );

  balance = getBalance({ accountToBalance: accountByOrigin });

  return res.status(201).send({
    origin: { id: origin, balance: balance },
  });
};

const transfer = ({
  amount,
  destination,
  file,
  origin,
  res,
}: TransferProps) => {
  let balanceOrigin = 0;
  let balanceDestination = 0;

  const hasAccountOrigin = file.some(
    (item) => Number(item.id) === Number(origin),
  );

  if (!hasAccountOrigin) {
    return res.status(404).send("0");
  }

  const newFileWithdraw = recordAccountMovement({
    amount,
    file,
    id: origin,
    type: "withdraw",
  });

  const accountByOrigin = newFileWithdraw.filter(
    (item) => Number(item.id) === Number(origin),
  );

  const newFileDeposit = recordAccountMovement({
    amount,
    file: newFileWithdraw,
    id: destination,
    type: "deposit",
  });

  const accountByDestination = newFileDeposit.filter(
    (item) => Number(item.id) === Number(destination),
  );

  balanceOrigin = getBalance({ accountToBalance: accountByOrigin });
  balanceDestination = getBalance({ accountToBalance: accountByDestination });

  return res.status(201).send({
    origin: { id: origin, balance: balanceOrigin },
    destination: {
      id: destination,
      balance: balanceDestination,
    },
  });
};

export const eventController = {
  createUpdate: (req: Request, res: Response) => {
    const { amount, destination, type, origin } = req.body;

    const file = eventService.getFile();

    if (file) {
      switch (type) {
        case "deposit":
          deposit({ amount, destination, file, res });
          break;

        case "withdraw":
          withdraw({ amount, file, origin, res });
          break;

        case "transfer":
          transfer({ amount, destination, file, origin, res });
          break;

        default:
          handleError(res, "Operação não disponível");
          break;
      }
    } else {
      handleError(res);
    }
  },
};
