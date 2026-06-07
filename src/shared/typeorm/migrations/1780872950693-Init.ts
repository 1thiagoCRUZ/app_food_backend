import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780872950693 implements MigrationInterface {
    name = 'Init1780872950693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "customerName" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customerPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryStreet" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryCity" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryState" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "deliveryZipCode" character varying`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "paymentMethod" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryZipCode"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryState"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryCity"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "deliveryStreet"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customerPhone"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customerName"`);
    }

}
