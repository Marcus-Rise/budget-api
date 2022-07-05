import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1657016430245 implements MigrationInterface {
  name = 'Transaction1657016430245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('Доход', 'Расход')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "category" character varying NOT NULL, "amount" integer NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "PK_fcce0ce5cc7762e90d2cc7e2307" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
  }
}
