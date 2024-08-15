import { Test, TestingModule } from '@nestjs/testing';
import { CustomerDto } from 'src/application/customer/create-customer.dto';
import { Customer } from 'src/domain/customer/customer.entity';
import { CustomerService } from 'src/domain/customer/customer.service';
import { AppModule } from 'src/infraestructure/app.module';
import { Failure, Success } from 'src/utils/result';


describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ AppModule ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  describe('createCustomer and getCustomer', () => {
    it('should create and then return the same customer', async () => {
      const customer:CustomerDto = {
        id:1,
        firstName: 'pepito',
        lastName: 'perez',
        email: 'pepito-perez@mail.com',
        password: "pepito123",
        createdAt: new Date()
      };
      const newCustomer = await service.createCustomer(customer) as Success<Customer>;;
      const fetchedCustomer = await service.getCustomer(newCustomer.value.id) as Success<CustomerDto>;

      expect(fetchedCustomer).toBeDefined();
      expect(fetchedCustomer.value.id).toBe(newCustomer.value.id)
      expect(fetchedCustomer.value.firstName).toBe(newCustomer.value.first_name);
      expect(fetchedCustomer.value.lastName).toBe(newCustomer.value.last_name);
      expect(fetchedCustomer.value.email).toBe(newCustomer.value.email);
    });

    it('should return a failure when find an inexistent id', async () => {
      const inexistentId = 100000;

      const fetchedCustomer = await service.getCustomer(inexistentId) as Failure<string>; 


      expect(fetchedCustomer.isFailure()).toBeTruthy()
      expect(fetchedCustomer.error).toBe(`Customer with ID ${inexistentId} not found`)
    })

  });
});


