import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from 'src/domain/customer/customer.service';
import { Customer } from 'src/domain/customer/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
