import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './auth/auth.dto';
import { productService } from 'src/domain/product/product.service';
import { AuthGuard } from 'src/infraestructure/utils/auth.guard';
import { ProductDto } from 'src/application/product/product.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(
        private readonly productService: productService
    ){}

    @Get()
    async GetProducts(){
        
        return this.productService.getProducts();
    }
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async PostProduct(@Body() payload : ProductDto){
        return this.productService.createProduct(payload)
    }
}