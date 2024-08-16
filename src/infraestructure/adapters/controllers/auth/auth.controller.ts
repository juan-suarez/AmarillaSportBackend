import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthService } from 'src/infraestructure/auth.service';
import { Response } from 'express';
import { CustomerService } from 'src/domain/customer/customer.service';
import { CreateCustomerDto } from 'src/application/customer/create-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerservice: CustomerService,
  ) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async Login(
    @Body() loginPayload: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.login(loginPayload);
    const millisecondsToAdd = 60 * 60 * 1000;

    response
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + millisecondsToAdd),
      })
      .send({ message: 'login successufully' });
  }

  @Delete('log-out')
  @UsePipes(new ValidationPipe({ transform: true }))
  LogOut(@Res({ passthrough: true }) response: Response) {
    response
      .clearCookie('accessToken')
      .send({ message: 'log out successfully' });
  }

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true }))
  async SignUp(@Body() signUpPayload: CreateCustomerDto) {
    const customer = await this.customerservice.createCustomer(signUpPayload);

    if (customer.isSuccess()) {
      return { message: 'Sign up successfully' };
    }

    return { message: 'failed sign up' };
  }
}
