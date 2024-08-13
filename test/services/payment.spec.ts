import { Test, TestingModule } from "@nestjs/testing";
import { PaymentDto } from "src/application/payment/payment.dto";
import { Payment } from "src/domain/payment/payment.entity";
import { paymentService } from "src/domain/payment/payment.service";
import { AppModule } from "src/infraestructure/app.module";
import { Failure, Success } from "src/utils/result";
import { v4 as uuid } from 'uuid';

describe('PaymentService', () => {
  let service: paymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<paymentService>(paymentService);
  });

  describe('createPayment and getPayment', () => {
    
    
    it('should create and then return the same payment', async () => {
      const transactions = await service.getTransactions();
      const payment: PaymentDto = {
        id: 1,
        status: 'pending',
        bankTransactionNumber: uuid(),
        paymentMethod: 'credit card',
        transaction: transactions[0],
        createdAt: new Date(),
        updateAt: new Date(), 
      };

      const newPayment = await service.createPayment(payment) as Success<Payment>;
      const fetchedPayment = await service.getPayment(newPayment.value.id) as Success<PaymentDto>;


      expect(fetchedPayment).toBeDefined();
      expect(fetchedPayment.value.id).toBe(newPayment.value.id)
      expect(fetchedPayment.value.bankTransactionNumber).toBe(newPayment.value.bank_transaction_number)
      expect(fetchedPayment.value.paymentMethod).toBe(newPayment.value.payment_method)
      expect(fetchedPayment.value.status).toBe(newPayment.value.status)

    });

    it('should return a failure when find an inexistent id', async () => {
      const inexistentId = 100000;

      const fetchedPayment = await service.getPayment(inexistentId) as Failure<string>;


      expect(fetchedPayment.isFailure()).toBeTruthy()
      expect(fetchedPayment.error).toBe(`Payment with ID ${inexistentId} not found`)
    })

  });
});