import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product.',
        example: 'Razer BlackWidow V4 X Mechanical Gaming Keyboard',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The description of the product.',
        example: 'YELLOW MECHANICAL LINEAR SWITCHES: With zero distance between actuation and reset points at 1.2mm and only 45g of force required — enjoy instant, rapid-fire inputs that are just as quiet thanks to built-in sound dampeners',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'The category that the prodcut belongs to.',
        example: 'Computers > Peripherals > Keyboards',
    })
    @IsString()
    category: string;

    @ApiProperty({
        description: 'The price of the product (must be a positive number).',
        example: '150.50',
        minimum: 0.01
    })
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 2
    })
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'Amount of available units of the product (must be a non negative integer).',
        example: 10,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    stock: number;
}
