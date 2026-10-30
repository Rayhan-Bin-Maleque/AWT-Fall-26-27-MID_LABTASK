
import { Type, Expose, Transform } from 'class-transformer';
import { isNotEmpty, IsNumber, IsString, IsNotEmpty, IsOptional, IsPositive, IsBoolean, IsInt, Min } from "class-validator";




export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    stock: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}