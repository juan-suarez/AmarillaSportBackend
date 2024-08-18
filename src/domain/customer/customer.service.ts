import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerDto } from './customer.dto';
import { CreateCustomerDto } from 'src/application/customer/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCustomers(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async getCustomer(id: number): Promise<Result<CustomerDto, string>> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      return new Failure(`Customer with ID ${id} not found`);
    }

    return new Success(this.mapToDto(customer));
  }

  async getCustomerByEmail(
    email: string,
    returnEntity: boolean = false,
  ): Promise<Result<CustomerDto | Customer, string>> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      return new Failure(`Customer with ID ${email} not found`);
    }

    if (returnEntity) {
      return new Success(this.mapToDto(customer));
    }

    return new Success(customer);
  }

  async createCustomer(
    customer: CreateCustomerDto,
  ): Promise<Result<CustomerDto, string>> {
    try {
      const newCustomer = this.customerRepository.create(customer);
      newCustomer.password = bcrypt.hashSync(customer.password, 10);

      return new Success(
        this.mapToDto(await this.customerRepository.save(newCustomer)),
      );
    } catch (error) {
      console.error(error);

      return new Failure('Failed to create Customer');
    }
  }

  private mapToDto(customer: Customer): CustomerDto {
    return {
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      password: customer.password,
      transactions: customer.transactions,
    };
  }
}
