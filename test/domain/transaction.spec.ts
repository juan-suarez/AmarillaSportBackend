import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from 'src/application/transaction/transaction.dto';
import * as bcrypt from 'bcrypt';
import { TransactionService } from 'src/domain/transaction/transaction.service';
import { Customer } from 'src/domain/customer/customer.entity';
import { TransactionDto } from 'src/domain/transaction/transaction.dto';
import { CustomerService } from 'src/domain/customer/customer.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<Transaction>;
  let customerService: CustomerService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: CustomerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTransaction', () => {
    it('should return a transaction when found', async () => {
      const transaction = {
        id: 1,
        transaction_number: '1234',
        base_fee: 500,
        delivery_fee: 200,
        total_amount: 700,
        status: 'PENDING',
      };
      mockRepository.findOne.mockResolvedValue(transaction);

      const result = await service.getTransaction(1);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          transactionNumber: '1234',
          baseFee: 500,
          deliveryFee: 200,
          totalAmount: 700,
          status: 'PENDING',
        });
      }
    });

    it('should return a failure when transaction is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getTransaction(1);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Transaction with ID 1 not found');
      }
    });
  });

  describe('getTransactionByRef', () => {
    it('should return a transaction when found', async () => {
      const transaction = {
        id: 1,
        transaction_number: '1234',
        base_fee: 500,
        delivery_fee: 200,
        total_amount: 700,
        status: 'PENDING',
        customer: Customer,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(transaction);

      const result = await service.getTransactionByRef('1234');
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(transaction);
      }
    });

    it('should return a failure when transaction is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getTransactionByRef('1233');
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe(`Transaction with ref 1233 not found`);
      }
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const transaction: TransactionDto = {
        transactionNumber: '1234',
        baseFee: 500,
        deliveryFee: 200,
        totalAmount: 700,
        status: 'PENDING',
        customer: null,
      };

      const crateTransaction = {
        transaction_number: transaction.transactionNumber,
        status: transaction.status,
        base_fee: transaction.baseFee,
        delivery_fee: transaction.deliveryFee,
        total_amount: transaction.totalAmount,
        customer: transaction.customer,
      };

      const createdTransaction = { ...crateTransaction, id: 1 };
      mockRepository.create.mockReturnValue(crateTransaction);
      mockRepository.save.mockResolvedValue(crateTransaction);

      const result = await service.createTransaction(transaction);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          transactionNumber: '1234',
          baseFee: 500,
          deliveryFee: 200,
          totalAmount: 700,
          status: 'PENDING',
          customer: null,
        });
      }
      expect(mockRepository.create).toHaveBeenCalledWith(crateTransaction);
      expect(mockRepository.save).toHaveBeenCalledWith(crateTransaction);
    });

    it('should return a failure when creation fails', async () => {
      const transaction: TransactionDto = {
        transactionNumber: '1234',
        baseFee: 500,
        deliveryFee: 200,
        totalAmount: 700,
        status: 'PENDING',
        customer: null,
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createTransaction(transaction);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create Transaction');
      }
    });
  });
});
