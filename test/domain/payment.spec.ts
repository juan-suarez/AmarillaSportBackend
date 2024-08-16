import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from 'src/domain/payment/payment.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paymentService } from 'src/domain/payment/payment.service';

describe('PaymentService', () => {
  let service: paymentService;
  let repository: Repository<Payment>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        paymentService,

        {
          provide: getRepositoryToken(Payment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<paymentService>(paymentService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPayment', () => {
    it('should return a payment when found', async () => {
      const payment = {
        payment_method: 'credit_card',
        status: 'pending',
        bank_transaction_number: '1234567890',
      };
      mockRepository.findOne.mockResolvedValue(payment);

      const result = await service.getPayment(1);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          paymentMethod: 'credit_card',
          status: 'pending',
          bankTransactionNumber: '1234567890',
        });
      }
    });

    it('should return a failure when payment is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getPayment(1);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Payment with ID 1 not found');
      }
    });
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const paymentData = {
        paymentMethod: 'credit_card',
        status: 'pending',
        bankTransactionNumber: '1234567890',
      };

      const createdPayment = {
        payment_method: 'credit_card',
        status: 'pending',
        bank_transaction_number: '1234567890',
      };
      mockRepository.create.mockReturnValue({ ...createdPayment, id: 1 });
      mockRepository.save.mockResolvedValue({ ...createdPayment, id: 1 });

      const result = await service.createPayment(paymentData);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          paymentMethod: 'credit_card',
          status: 'pending',
          bankTransactionNumber: '1234567890',
        });
      }
      expect(mockRepository.create).toHaveBeenCalledWith(createdPayment);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...createdPayment,
        id: 1,
      });
    });

    it('should return a failure when creation fails', async () => {
      const paymentData = {
        payment_method: 'credit_card',
        status: 'pending',
        bank_transaction_number: '1234567890',
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createPayment(paymentData);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create payment');
      }
    });
  });
});
