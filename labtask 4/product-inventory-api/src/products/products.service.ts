import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { products } from './entities/products.entity.js';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-prpduct.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ILike } from 'typeorm/browser/find-options/operator/ILike.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(products)
    private productsRepository: Repository<products>,
  ) {}

  async create(product: CreateProductDto): Promise<products | string> {
    try {
      const newProduct = await this.productsRepository.create(product);
      return await this.productsRepository.save(newProduct);
    } 
    catch (error) {
      throw new BadRequestException('Error creating product');
    }

    }

    async findAll(): Promise<products[] | string> {
        try {
            const products = await this.productsRepository.find({
                order: {
                    createdAt: 'DESC',
                }
            });
            return products;
            
        }
        catch (error) {
            throw new BadRequestException('Error fetching products');
        }
    }


    async findOne(id: number): Promise<products | string> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id }
            });
            if (!product) {
                throw new BadRequestException('Product not found');
            }
            return product;
        } catch (error) {
            throw new BadRequestException('Error fetching product');
        }
    }


    async update(id: number, product: PartialUpdateProductDto): Promise<products | string> {
        try {
            const existingProduct = await this.productsRepository.findOne({ 
                where: { id }
            });
            if (!existingProduct) {
                throw new BadRequestException('Product not found');
            }
            Object.assign(existingProduct, product);
            return await this.productsRepository.save(existingProduct);
        } catch (error) {
            throw new BadRequestException('Error updating product');
        }
    }



    async replace(id:number, product: UpdateProductDto): Promise<products | string> {   

        try {
            await this.findOne(id);
            await this.productsRepository.update(id, product);
            return await this.findOne(id);
        }
        catch (error) {
            throw new BadRequestException('Error replacing product');
        } 
    }


   async remove(id: number): Promise<products> {
    try {
        const pro = await this.productsRepository.findOne({
            where: { id }
        });

        if (!pro) {
            throw new BadRequestException('Product not found');
        }

        await this.productsRepository.remove(pro);

        return pro;

    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }

        throw new BadRequestException('Error removing product');
    }
}
    

     async findByCategory(category: string): Promise<products[] | string> {

        try {
            const products = await this.productsRepository.find({
                where: { category }
            });

            return products;
        } catch (error) {
            throw new BadRequestException('Error fetching products by category');
        }   

    }


    async search(keyword: string) {
        
        try {
            const products = await this.productsRepository.find({
               where: {
          name: ILike(`%${keyword}%`),
        },
      });

      return {
        message: 'Products searched successfully',
        count: products.length,
        data: products,
        };
        } catch {
      throw new BadRequestException('Product search failed');
    }
  }

  async toggleActiveStatus(id: number): Promise<products | string> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      product.isActive = !product.isActive;

      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error toggling product status');
    }
  }

}
