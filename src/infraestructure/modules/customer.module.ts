import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from 'src/application/services/customer.service';
import { Customer } from 'src/domain/entities/customer.entity';
import { TransactionModule } from './transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
