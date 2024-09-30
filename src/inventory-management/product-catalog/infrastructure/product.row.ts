import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ColumnNumericTransformer } from './column-numeric.transformer';

@Entity('products')
export class ProductRow {
  constructor(partial: Partial<ProductRow>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column()
  stock: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  updateDates() {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
