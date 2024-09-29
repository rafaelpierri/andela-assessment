import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCreatedAtAndUpdatedAtColumns1727639413445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "created_at" TYPE timestamp(3) USING "created_at"::timestamp(3);
        `);

        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "updated_at" TYPE timestamp(3) USING "updated_at"::timestamp(3);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "created_at" TYPE timestamp USING "created_at"::timestamp;
        `);

        await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "updated_at" TYPE timestamp USING "updated_at"::timestamp;
        `);
    }
}
