export type AccountType = "deposit" | "withdraw" | "transfer";

export interface Account {
  id: number;
  amount: number;
  type: AccountType;
}
