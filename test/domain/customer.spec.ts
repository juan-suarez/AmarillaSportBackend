import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from 'src/application/customer/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { CustomerService } from 'src/domain/customer/customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCustomers', () => {
    it('should return an array of customers', async () => {
      const customers = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
      mockRepository.find.mockResolvedValue(customers);

      const result = await service.getCustomers();
      expect(result).toEqual(customers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getCustomer', () => {
    it('should return a customer when found', async () => {
      const customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashed',
        transactions: [],
      };
      mockRepository.findOne.mockResolvedValue(customer);

      const result = await service.getCustomer(1);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashed',
          transactions: [],
        });
      }
    });

    it('should return a failure when customer is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getCustomer(1);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Customer with ID 1 not found');
      }
    });
  });

  describe('getCustomerByEmail', () => {
    it('should return a customer when found', async () => {
      const customer = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashed',
        transactions: [],
      };
      mockRepository.findOne.mockResolvedValue(customer);

      const result = await service.getCustomerByEmail('john@example.com');
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual(customer);
      }
    });

    it('should return a failure when customer is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getCustomerByEmail(
        'nonexistent@example.com',
      );
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe(
          'Customer with ID nonexistent@example.com not found',
        );
      }
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const createdCustomer = {
        ...createCustomerDto,
        id: 1,
        password: hashedPassword,
        transactions: [],
      };
      mockRepository.create.mockReturnValue(createdCustomer);
      mockRepository.save.mockResolvedValue(createdCustomer);

      const result = await service.createCustomer(createCustomerDto);
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        expect(result.value).toEqual({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: hashedPassword,
          transactions: [],
        });
      }
      expect(mockRepository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createCustomerDto);
    });

    it('should return a failure when creation fails', async () => {
      const createCustomerDto: CreateCustomerDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.createCustomer(createCustomerDto);
      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBe('Failed to create Customer');
      }
    });
  });
});
