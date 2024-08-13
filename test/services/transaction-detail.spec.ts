import { Test, TestingModule } from "@nestjs/testing";
import { TransactionDetailDto } from "src/application/transaction/transaction-detail.dto";
import { TransactionDetail } from "src/domain/transaction/transaction-detail.entity";
import { TransactionDetailService } from "src/domain/transaction/transaction-detail.service";
import { AppModule } from "src/infraestructure/app.module";
import { Failure, Success } from "src/utils/result";

describe('TransactionDetailService', () => {
  let service: TransactionDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TransactionDetailService>(TransactionDetailService);
  });

  describe('createTransactionDetail and getTransactionDetail', () => {
    
    
    it('should create and then return the same transaction detail', async () => {
      const transactions = await service.getTransactions();
      const transactionDetail: TransactionDetailDto = {
        id: 1,
        quantity:0,
        transaction:transactions[0],
        createdAt: new Date(),
      };

      const newTransactionDetail = await service.createTransactionDetail(transactionDetail) as Success<TransactionDetail>;
      const fetchedTransactionDetail = await service.getTransactionDetail(newTransactionDetail.value.id) as Success<TransactionDetailDto>;


      expect(fetchedTransactionDetail).toBeDefined();
      expect(fetchedTransactionDetail.value.id).toBe(newTransactionDetail.value.id)
      expect(fetchedTransactionDetail.value.quantity).toBe(newTransactionDetail.value.quantity)
    });

    it('should return a failure when find an inexistent id', async () => {
      const inexistentId = 100000;

      const fetchedCustomer = await service.getTransactionDetail(inexistentId) as Failure<string>;


      expect(fetchedCustomer.isFailure()).toBeTruthy()
      expect(fetchedCustomer.error).toBe(`TransactionDetail with ID ${inexistentId} not found`)
    })

  });
});