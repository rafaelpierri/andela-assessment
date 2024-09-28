import { ApiProperty } from "@nestjs/swagger";
import { ProductData } from "./product.dto";

class PaginationMetadata {
    constructor(partial: Partial<PaginationMetadata>) {
        Object.assign(this, partial);
    }

    @ApiProperty({
        description: 'The amount of records available.',
        example: 10,
        required: false,
    })
    total: number;

    @ApiProperty({
        description: 'The current page.',
        example: 1,
        required: false,
    })
    page: number;

    @ApiProperty({
        description: 'The amount of records per page.',
        example: 1,
        required: false,
    })
    perPage: number;

    @ApiProperty({
        description: 'The amount of pages available.',
        example: 10,
        required: false,
    })
    totalPages: number;
}

export class ProductListDto {
    @ApiProperty({
        description: 'The page of the product list.',
        type: [ProductData],
        required: false,
    })
    data: ProductData[];
    @ApiProperty({
        description: 'Metadata about pagination.',
        type: PaginationMetadata,
        required: false,
    })
    meta: PaginationMetadata;

    constructor(products: Array<{
        id: number;
        name: string;
        description: string;
        category: string;
        price: number;
        stock: number;
        createdAt: Date;
        updatedAt: Date;
    }>, meta: Partial<PaginationMetadata>) {
        this.data = products.map(product => new ProductData(product));
        this.meta = new PaginationMetadata(meta);
    }
}
