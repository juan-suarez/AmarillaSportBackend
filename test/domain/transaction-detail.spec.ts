import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { CustomerService } from 'src/domain/customer/customer.service';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { TransactionDetailService } from 'src/domain/transaction-details/transaction-detail.service';
import { Payment } from 'src/domain/payment/payment.entity';
import { Product } from 'src/domain/product/product.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Order } from 'src/domain/order/order.entity';
import { TransactionService } from 'src/domain/transaction/transaction.service';

describe('TransactionDetailService', () => {
  let service: TransactionDetailService;
  let transactionDetailRepository: Repository<TransactionDetail>;
  let customerService: CustomerService;
  let transactionService: TransactionService;

  const mockTransactionDetailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCustomerService = {
    // Add any methods from CustomerService that TransactionDetailService uses
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionDetailService,
        {
          provide: getRepositoryToken(TransactionDetail),
          useValue: mockTransactionDetailRepository,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
        {
          provide: TransactionService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    service = module.get<TransactionDetailService>(TransactionDetailService);
    transactionDetailRepository = module.get<Repository<TransactionDetail>>(
      getRepositoryToken(TransactionDetail),
    );
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransactionDetail', () => {
    it('should create a new transactionDetail successfully', async () => {
      const customer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        transactions: [] as Transaction[],
        orders: [] as Order[],
        created_at: new Date(),
      };

      const product: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 10.99,
        stock: 100,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      const transaction: Transaction = {
        id: 1,
        transaction_number: uuid(),
        base_fee: 500,
        delivery_fee: 200,
        total_amount: 700,
        status: 'PENDING',
        customer: customer,
        payment: {} as Payment[],
        detail: [] as TransactionDetail[],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const transactionDetails: TransactionDetail[] = [
        {
          id: 1,
          quantity: 2,
          transaction: transaction,
          product: product,
          order: null as Order | null,
          created_at: new Date(),
        },
      ];

      mockTransactionDetailRepository.create.mockReturnValue(
        transactionDetails,
      );
      mockTransactionDetailRepository.save.mockResolvedValue(
        transactionDetails,
      );

      const result = await service.createTransactionDetail({
        transaction,
        quantity: 5,
      });

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(transactionDetails);
      }

      expect(mockTransactionDetailRepository.create).toHaveBeenCalledWith({
        transaction,
        quantity: 5,
      });
      expect(mockTransactionDetailRepository.save).toHaveBeenCalledWith(
        transactionDetails,
      );
    });

    it('should return a failure when transactionDetail creation fails', async () => {
      const customer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        transactions: [] as Transaction[],
        orders: [] as Order[],
        created_at: new Date(),
      };

      const product: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 10.99,
        stock: 100,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      const transaction: Transaction = {
        id: 1,
        transaction_number: uuid(),
        base_fee: 500,
        delivery_fee: 200,
        total_amount: 700,
        status: 'PENDING',
        customer: customer,
        payment: {} as Payment[],
        detail: [] as TransactionDetail[],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const transactionDetails: TransactionDetail[] = [
        {
          id: 1,
          quantity: 2,
          transaction: transaction,
          product: product,
          order: null as Order | null,
          created_at: new Date(),
        },
      ];

      mockTransactionDetailRepository.create.mockReturnValue(
        transactionDetails,
      );
      mockTransactionDetailRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.createTransactionDetail({
        transaction,
        quantity: 5,
      });

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create TransactionDetail');
      }

      expect(mockTransactionDetailRepository.create).toHaveBeenCalledWith({
        transaction,
        quantity: 5,
      });
      expect(mockTransactionDetailRepository.save).toHaveBeenCalledWith(
        transactionDetails,
      );
    });

    describe('getTransactionDetail', () => {
      it('should return a  transactionDetail when found', async () => {
        const transactionDetails = {
          id: 1,
          quantity: 2,
          order: null as Order | null,
        };

        mockTransactionDetailRepository.findOne.mockResolvedValue(
          transactionDetails,
        );

        const result = await service.getTransactionDetail(1);

        expect(result.isSuccess()).toBe(true);
        if (result.isSuccess()) {
          expect(result.value).toEqual(transactionDetails);
        }

        expect(mockTransactionDetailRepository.findOne).toHaveBeenCalledWith({
          where: { id: transactionDetails.id },
        });
      });

      it('should return a failure when transactionDetail is not found', async () => {
        mockTransactionDetailRepository.findOne.mockResolvedValue(null);

        const result = await service.getTransactionDetail(1);

        expect(result.isSuccess()).toBe(false);
        if (result.isFailure()) {
          expect(result.error).toEqual(
            `TransactionDetail with ID ${1} not found`,
          );
        }
        expect(mockTransactionDetailRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
        });
      });
    });
  });
});
