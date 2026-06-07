import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780799888001 implements MigrationInterface {
    name = 'Init1780799888001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zipCode" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT true, "latitude" numeric(10,8), "longitude" numeric(11,8), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "email" character varying NOT NULL, "cpf" character varying(11), "phone" character varying(20), "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant_addresses" ("id" SERIAL NOT NULL, "restaurantId" integer NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zipCode" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT true, "latitude" numeric(10,8), "longitude" numeric(11,8), CONSTRAINT "PK_39927b1630f1c0316d49280b76d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurants" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cnpj" character varying NOT NULL, "isOpen" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2e2e580139283698508622086d9" UNIQUE ("cnpj"), CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupons" ("id" SERIAL NOT NULL, "restaurant_id" integer NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "min" numeric(10,2) NOT NULL, "uses" integer NOT NULL DEFAULT '0', "limit" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "transactionId" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "method" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c39d78e8744809ece8ca95730e2" UNIQUE ("transactionId"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "orderId" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "restaurantId" integer NOT NULL, "deliveryAddressId" integer, "total" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'AWAITING_PAYMENT', "deliveryVerificationCode" character varying(4), "pickupVerificationCode" character varying(4), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "courierId" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'FINDING_COURIER', "destLat" numeric(10,8), "destLng" numeric(11,8), "distanceMeters" integer, "estimatedDurationSeconds" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "couriers" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "isOnline" boolean NOT NULL DEFAULT false, "currentLat" numeric(10,8), "currentLng" numeric(11,8), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3b2f2653c69a586006e793bd0a3" UNIQUE ("userId"), CONSTRAINT "PK_141c3ed6f70beb9ddf4ab4a0e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "restaurantId" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "originalPrice" numeric(10,2), "image" character varying, "category" character varying, "available" boolean NOT NULL DEFAULT true, "stock" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant_addresses" ADD CONSTRAINT "FK_64c40f0db71358eb1ac26b59588" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coupons" ADD CONSTRAINT "FK_2bd0b930cb13d618264336c0dc0" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`ALTER TABLE "coupons" DROP CONSTRAINT "FK_2bd0b930cb13d618264336c0dc0"`);
        await queryRunner.query(`ALTER TABLE "restaurant_addresses" DROP CONSTRAINT "FK_64c40f0db71358eb1ac26b59588"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "couriers"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "coupons"`);
        await queryRunner.query(`DROP TABLE "restaurants"`);
        await queryRunner.query(`DROP TABLE "restaurant_addresses"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
