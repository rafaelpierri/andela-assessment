import { ApiProperty } from "@nestjs/swagger";
import { ProductData } from "./product.dto";
import { PaginationMetadata } from "../../../../commons/presentation/dto/pagination-metadata";

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
