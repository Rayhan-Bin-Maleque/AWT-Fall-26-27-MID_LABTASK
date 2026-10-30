import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { products } from './entities/products.entity.js';
import { Body, Post } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-prpduct.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create-products')
  async create(@Body() product: CreateProductDto): Promise<products | string> {
    return await this.productsService.create(product);
  }

  @Get()
  async findAll(): Promise<products[] | string> {
    return await this.productsService.findAll();
  }

  @Get('Search')
  async search(@Query('keyword') keyword: string) {
    return await this.productsService.search(keyword);
  }

  @Get('category/:cat')
  async findByCategory(@Param('cat') cat: string) {
    return await this.productsService.findByCategory(cat);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

    @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: PartialUpdateProductDto,
  ) {
    return await this.productsService.update(id, product);
  }

  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ) {
    return await this.productsService.replace(id, product);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }

  @Patch(':id/toggle')
  async toggleActiveStatus(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.toggleActiveStatus(id);
  }
}


