import { Transaction } from "../transaction/transaction.entity";

export class CustomerDto {

  readonly id: number;

  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  readonly password: string;

  transactions: Transaction[];
}