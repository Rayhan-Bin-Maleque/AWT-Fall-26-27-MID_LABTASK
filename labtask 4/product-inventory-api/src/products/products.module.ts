import { Module } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { products } from './entities/products.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([products])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
