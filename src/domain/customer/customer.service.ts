import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/domain/customer/customer.entity';
import { Failure, Result, Success } from 'src/utils/result';
import { Repository } from 'typeorm';
import { CustomerDto } from 'src/application/customer/create-customer.dto';

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

  async createCustomer({ firstName, lastName , email}: CustomerDto): Promise<Result<Customer,string>>{
    try{
      const newCustomer = this.customerRepository.create({
        first_name:firstName,
        last_name: lastName,
        email
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
      createdAt:customer.created_at
    };
  }

}
