import { Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTransactionDto } from 'src/application/transaction/transaction.dto';
import { TransactionOrchestrator } from 'src/application/transaction/transaction.service';
import { AuthGuard } from 'src/infraestructure/utils/auth.guard';

@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {

    constructor(
        private readonly transactionOrhestrator: TransactionOrchestrator,
    ){}

    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() body: CreateTransactionDto, @Request() req: any){
        const { userId, email} = req.user;

        return { message : await this.transactionOrhestrator.createTransaction(body,userId,email)}
    }

    @Post('webhook')
    async webHook(@Body() payload){
        const { reference, status, id, customer_email } = payload.data[0]

        return await this.transactionOrhestrator.confirmTransaction(reference,status)
    }
    
    @Get()
    async get(@Query('ref') ref){
        return await this.transactionOrhestrator.getTransaction(ref);
    }
}