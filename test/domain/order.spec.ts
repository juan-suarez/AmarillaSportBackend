import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Order } from 'src/domain/order/order.entity';
import { OrderService } from 'src/domain/order/order.service';
import { Payment } from 'src/domain/payment/payment.entity';
import { Product } from 'src/domain/product/product.entity';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let customerService: CustomerService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCustomerService = {
    // Add any methods from CustomerService that OrderService uses
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    customerService = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
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

      const newOrder: Order = {
        id: 1,
        created_at: new Date(),
        customer: customer,
        transaction_details: transactionDetails,
      };

      mockOrderRepository.create.mockReturnValue(newOrder);
      mockOrderRepository.save.mockResolvedValue(newOrder);

      const result = await service.createOrder(customer, transactionDetails);

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(newOrder);
      }

      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        transaction_details: transactionDetails,
        customer,
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(newOrder);
    });

    it('should return a failure when order creation fails', async () => {
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

      const newOrder: Order = {
        id: 1,
        created_at: new Date(),
        customer: customer,
        transaction_details: transactionDetails,
      };

      mockOrderRepository.create.mockReturnValue(newOrder);
      mockOrderRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createOrder(customer, transactionDetails);

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create Order');
      }

      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        transaction_details: transactionDetails,
        customer,
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(newOrder);
    });
  });
});
