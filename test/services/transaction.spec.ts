import { Test, TestingModule } from "@nestjs/testing";
import { TransactionDto } from "src/application/transaction/transaction.dto";
import { Transaction } from "src/domain/transaction/transaction.entity";
import { TransactionService } from "src/domain/transaction/Transaction.service";
import { AppModule } from "src/infraestructure/app.module";
import { Failure, Success } from "src/utils/result";
import { v4 as uuid } from 'uuid';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  describe('createtransaction and getTransaction', () => {
    
    
    it('should create and then return the same transaction', async () => {
      const customers = await service.getCustomers();
      const transaction: TransactionDto = {
        transactionNumber: uuid(),
        baseFee: 0,
        deliveryFee: 0,
        totalAmount: 0,
        status: 'Pending',
        customer: customers[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newTransaction = await service.createTransaction(transaction) as Success<Transaction>;
      const fetchedTransaction = await service.getTransaction(newTransaction.value.id) as Success<TransactionDto>;

      expect(fetchedTransaction).toBeDefined();
      expect(fetchedTransaction.value.status).toBe(newTransaction.value.status);
      expect(fetchedTransaction.value.transactionNumber).toBe(newTransaction.value.transaction_number)
    });

    it('should return a failure when find an inexistent id', async () => {
      const inexistentId = 100000;

      const fetchedTransaction = await service.getTransaction(inexistentId) as Failure<string>;


      expect(fetchedTransaction.isFailure()).toBeTruthy()
      expect(fetchedTransaction.error).toBe(`Transaction with ID ${inexistentId} not found`)
    })

  });
});