import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from 'src/domain/transaction/transaction.service';
import { BankService } from 'src/infraestructure/adapters/gateways/bank.service';
import { CustomerService } from 'src/domain/customer/customer.service';
import { paymentService } from 'src/domain/payment/payment.service';
import { productService } from 'src/domain/product/product.service';
import { TransactionDetailService } from 'src/domain/transaction-details/transaction-detail.service';
import { OrderService } from 'src/domain/order/order.service';
import {
  CreateTransactionDto,
  CardDetailsDto,
  shippingAddressDetailsDto,
  ShoppingCartProdcutsDto,
} from 'src/application/transaction/transaction.dto';
import { Customer } from 'src/domain/customer/customer.entity';
import { Product } from 'src/domain/product/product.entity';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { Success, Failure } from 'src/utils/result';
import { TransactionOrchestrator } from 'src/application/transaction/transaction.service';
import { TransactionDto } from 'src/domain/transaction/transaction.dto';
import { Payment } from 'src/domain/payment/payment.entity';
import { TransactionDetail } from 'src/domain/transaction-details/transaction-detail.entity';

describe('TransactionOrchestrator', () => {
  let service: TransactionOrchestrator;
  let transactionService: jest.Mocked<TransactionService>;
  let bankService: jest.Mocked<BankService>;
  let customerService: jest.Mocked<CustomerService>;
  let paymentServiceMock: jest.Mocked<paymentService>;
  let productServiceMock: jest.Mocked<productService>;
  let transactionDetailService: jest.Mocked<TransactionDetailService>;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionOrchestrator,
        {
          provide: TransactionService,
          useValue: {
            createTransaction: jest.fn(),
            updateTransactionStatus: jest.fn(),
            getTransactionByRef: jest.fn(),
          },
        },
        {
          provide: BankService,
          useValue: {
            getAcceptanceToken: jest.fn(),
            cardTokenization: jest.fn(),
            CreateTransaction: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            getCustomerByEmail: jest.fn(),
          },
        },
        {
          provide: paymentService,
          useValue: {
            createPayment: jest.fn(),
            updatePaymentStatus: jest.fn(),
          },
        },
        {
          provide: productService,
          useValue: {
            findProductsByIds: jest.fn(),
            updateStock: jest.fn(),
          },
        },
        {
          provide: TransactionDetailService,
          useValue: {
            createTransactionDetails: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionOrchestrator>(TransactionOrchestrator);
    transactionService = module.get(TransactionService);
    bankService = module.get(BankService);
    customerService = module.get(CustomerService);
    paymentServiceMock = module.get(paymentService);
    productServiceMock = module.get(productService);
    transactionDetailService = module.get(TransactionDetailService);
    orderService = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockCardDetails: CardDetailsDto = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '2025',
        card_holder: 'John Doe',
      };

      const mockShippingAddress: shippingAddressDetailsDto = {
        address_line_1: '123 Main St',
        country: 'US',
        region: 'CA',
        city: 'Los Angeles',
        phone_number: '1234567890',
        address_line_2: 'Apt 4B',
        name: 'John Doe',
        postal_code: '90001',
      };

      const mockShoppingCartProduct: ShoppingCartProdcutsDto = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        quantity: 2,
      };

      const mockPayload: CreateTransactionDto = {
        base_fee: 1000,
        delivery_fee: 500,
        total_amount: 1500,
        installments: 1,
        card_details: mockCardDetails,
        shipping_address_details: mockShippingAddress,
        shopping_cart_prodcuts: [mockShoppingCartProduct],
      };

      const mockCustomer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        transactions: [],
        orders: [],
        created_at: new Date(),
      };

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        stock: 10,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      const mockTransaction: Transaction = {
        id: 1,
        transaction_number: 'TRANS123',
        base_fee: 1000,
        delivery_fee: 500,
        total_amount: 1500,
        customer: mockCustomer,
        status: 'PENDING',
        created_at: new Date(),
        detail: [],
        payment: [],
        updated_at: new Date(),
      };

      productServiceMock.findProductsByIds.mockResolvedValue(
        new Success([mockProduct]),
      );
      bankService.getAcceptanceToken.mockResolvedValue(
        new Success('mock_token'),
      );
      bankService.cardTokenization.mockResolvedValue(
        new Success('mock_card_token'),
      );
      bankService.CreateTransaction.mockResolvedValue(
        new Success({ id: 'mock_bank_transaction_id' }),
      );
      customerService.getCustomerByEmail.mockResolvedValue(
        new Success(mockCustomer),
      );
      transactionService.createTransaction.mockResolvedValue(
        new Success(mockTransaction),
      );
      transactionDetailService.createTransactionDetails.mockResolvedValue(
        new Success([]),
      );
      paymentServiceMock.createPayment.mockResolvedValue(new Success(null));

      const result = await service.createTransaction(
        mockPayload,
        'john@example.com',
      );

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value.transaction_number).toBe('TRANS123');
      }

      expect(productServiceMock.findProductsByIds).toHaveBeenCalledWith(
        [1],
        true,
      );
      expect(bankService.getAcceptanceToken).toHaveBeenCalledWith(
        expect.any(String),
      );
      expect(bankService.cardTokenization).toHaveBeenCalledWith(
        mockCardDetails,
        expect.any(String),
      );
      expect(bankService.CreateTransaction).toHaveBeenCalled();
      expect(customerService.getCustomerByEmail).toHaveBeenCalledWith(
        'john@example.com',
        true,
      );
      expect(transactionService.createTransaction).toHaveBeenCalled();
      expect(
        transactionDetailService.createTransactionDetails,
      ).toHaveBeenCalled();
      expect(paymentServiceMock.createPayment).toHaveBeenCalled();
    });

    it('should return failure when product stock is unavailable', async () => {
      const mockCardDetails: CardDetailsDto = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '2025',
        card_holder: 'John Doe',
      };

      const mockShippingAddress: shippingAddressDetailsDto = {
        address_line_1: '123 Main St',
        country: 'US',
        region: 'CA',
        city: 'Los Angeles',
        phone_number: '1234567890',
        address_line_2: 'Apt 4B',
        name: 'John Doe',
        postal_code: '90001',
      };

      const mockShoppingCartProduct: ShoppingCartProdcutsDto = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        quantity: 2,
      };

      const mockPayload: CreateTransactionDto = {
        base_fee: 1000,
        delivery_fee: 500,
        total_amount: 1500,
        installments: 1,
        card_details: mockCardDetails,
        shipping_address_details: mockShippingAddress,
        shopping_cart_prodcuts: [mockShoppingCartProduct],
      };

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        stock: 0,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      productServiceMock.findProductsByIds.mockResolvedValue(
        new Success([mockProduct]),
      );

      const result = await service.createTransaction(
        mockPayload,
        'john@example.com',
      );

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Stock unavailable');
      }
    });

    // Add more test cases for other failure scenarios
  });

  describe('confirmTransaction', () => {
    it('should confirm transaction successfully', async () => {
      const mockCustomer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        transactions: [],
        orders: [],
        created_at: new Date(),
      };

      const mockPayment: Payment = {
        id: 1,
        payment_method: 'CARD',
        transaction: null,
        status: 'PENDING',
        bank_transaction_number: '1234',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        stock: 0,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      const mockTransactionDetail: TransactionDetail = {
        id: 1,
        quantity: 3,
        created_at: new Date(),
        product: mockProduct,
        transaction: null,
        order: null,
      };

      const mockTransaction: TransactionDto = {
        id: 1,
        transactionNumber: 'TRANS123',
        baseFee: 1000,
        deliveryFee: 500,
        totalAmount: 1500,
        customer: mockCustomer,
        status: 'PENDING',
        payments: [mockPayment],
        transactionDetails: [mockTransactionDetail],
      };

      transactionService.updateTransactionStatus.mockResolvedValue(
        new Success(mockTransaction),
      );
      paymentServiceMock.updatePaymentStatus.mockResolvedValue(
        new Success(null),
      );
      orderService.createOrder.mockResolvedValue(new Success(null));
      productServiceMock.updateStock.mockResolvedValue(new Success(null));

      const result = await service.confirmTransaction('TRANS123', 'APPROVED');

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toBe('Order created succesfully');
      }

      expect(transactionService.updateTransactionStatus).toHaveBeenCalledWith(
        'TRANS123',
        'APPROVED',
      );
      expect(paymentServiceMock.updatePaymentStatus).toHaveBeenCalled();
      expect(orderService.createOrder).toHaveBeenCalled();
      expect(productServiceMock.updateStock).toHaveBeenCalled();
    });

    it('should return failure when transaction is not approved', async () => {
      const mockCustomer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        transactions: [],
        orders: [],
        created_at: new Date(),
      };

      const mockPayment: Payment = {
        id: 1,
        payment_method: 'CARD',
        transaction: null,
        status: 'PENDING',
        bank_transaction_number: '1234',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockProduct: Product = {
        id: 1,
        name: 'Test Product',
        description: 'A test product',
        price: 100,
        stock: 0,
        detail: null,
        image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
      };

      const mockTransactionDetail: TransactionDetail = {
        id: 1,
        quantity: 3,
        created_at: new Date(),
        product: mockProduct,
        transaction: null,
        order: null,
      };

      const mockTransaction: TransactionDto = {
        id: 1,
        transactionNumber: 'TRANS123',
        baseFee: 1000,
        deliveryFee: 500,
        totalAmount: 1500,
        customer: mockCustomer,
        status: 'PENDING',
        payments: [mockPayment],
        transactionDetails: [mockTransactionDetail],
      };

      transactionService.updateTransactionStatus.mockResolvedValue(
        new Success(mockTransaction),
      );
      paymentServiceMock.updatePaymentStatus.mockResolvedValue(
        new Success(null),
      );

      const result = await service.confirmTransaction('TRANS123', 'DECLINED');

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Unapproved bank transaction');
      }
    });

    // Add more test cases for other failure scenarios
  });

  describe('getTransaction', () => {
    it('should get transaction successfully', async () => {
      const mockCustomer: Customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        transactions: [],
        orders: [],
        created_at: new Date(),
      };

      const mockTransaction: Transaction = {
        id: 1,
        transaction_number: 'TRANS123',
        base_fee: 1000,
        delivery_fee: 500,
        total_amount: 1500,
        customer: mockCustomer,
        status: 'PENDING',
        created_at: new Date(),
        detail: [],
        payment: [],
        updated_at: new Date(),
      };

      transactionService.getTransactionByRef.mockResolvedValue(
        new Success(mockTransaction),
      );

      const result = await service.getTransaction('TRANS123');

      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(mockTransaction);
      }

      expect(transactionService.getTransactionByRef).toHaveBeenCalledWith(
        'TRANS123',
      );
    });
  });
});
