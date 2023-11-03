export const operationHandlers = {
  deposit: (balance: number, amount: number) => balance + amount,
  transfer: (balance: number, amount: number) => balance - amount,
  withdraw: (balance: number, amount: number) => balance - amount,
};
