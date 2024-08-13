import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/infraestructure/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
// import { TransactionDto } from 'src/application/transaction/transaction.dto';

// @Controller('transaction')
// export class SrcController {

//     @Post('')
//     @UsePipes(new ValidationPipe({ transform: true }))
//     async create(@Body() body: TransactionDto){
//         console.log(body);
//         return { message : "sisa" }
//     }
// }