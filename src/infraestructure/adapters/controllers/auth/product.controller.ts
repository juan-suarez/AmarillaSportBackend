import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { productService } from 'src/domain/product/product.service';
import { AuthGuard } from 'src/infraestructure/utils/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
    constructor(
        private readonly productService: productService
    ){}

    @Get()
    async Login(@Body() loginPayload:LoginDto){
        
        return this.productService.getProducts();
    }
}