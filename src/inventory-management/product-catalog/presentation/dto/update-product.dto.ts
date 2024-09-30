import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, Min } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({
        description: 'Amount of available units of the product (must be a non negative integer).',
        example: 10,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty({
        description: 'The last time the product was updated. This value will be used to detect race conditions.',
        example: '2024-09-28T00:52:46.316Z',
    })
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}
