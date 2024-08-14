import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { Repository } from 'typeorm';
import { CreateCustomerDto, CustomerDto } from 'src/application/customer/create-customer.dto';
import * as bcrypt  from 'bcrypt'

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

  ) { }

  async getCustomers():Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async getCustomer(id: number): Promise<Result<CustomerDto, string>> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      return new Failure(`Customer with ID ${id} not found`);
    }

    return new Success(this.mapToDto(customer));

  }

  async getCustomerByEmail(email: string): Promise<Result<Customer, string>> {
    const customer = await this.customerRepository.findOne({ where: { email } });

    if (!customer) {
      return new Failure(`Customer with ID ${email} not found`);
    }

    return new Success(customer);

  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Result<Customer,string>>{ //delete all dtos in domain layout
    try{
      const newCustomer = this.customerRepository.create({
        first_name:createCustomerDto.firstName,
        last_name: createCustomerDto.lastName,
        password: bcrypt.hashSync(createCustomerDto.password,10),
        email:createCustomerDto.email,
      });

      return new Success( await this.customerRepository.save(newCustomer));
    } catch(error) {
      console.log(error);
      return new Failure('Failed to create Customer');
    }

  }

  private mapToDto(customer: Customer): CustomerDto {
    return {
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email:customer.email,
      password: customer.password,
      createdAt:customer.created_at
    };
  }

}
