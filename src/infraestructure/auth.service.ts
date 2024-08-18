import { Inject } from '@nestjs/common';
import { CustomerService } from 'src/domain/customer/customer.service';
import { LoginDto } from './adapters/controllers/auth/auth.dto';
import { Failure, Result, Success } from 'src/utils/result';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerDto } from 'src/domain/customer/customer.dto';

export class AuthService {
  constructor(
    @Inject() private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto):Promise<Result<string,string>> {
    const fetchedCustomer =
      await this.customerService.getCustomerByEmail(email);

    if (fetchedCustomer.isFailure()) {
      return new Failure('customer not found');
    }
    const customer = fetchedCustomer.value as CustomerDto;
    const passwordsAreNotEqual =! await bcrypt.compare(
      password,
      customer.password,
    );
    if (passwordsAreNotEqual) {
      return new Failure('Incorrect password');
    }

    const payload = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    };

    return new Success(await this.jwtService.signAsync(payload, {
      secret: 'secreto',
      expiresIn: '60m',
    }));
  }
}
