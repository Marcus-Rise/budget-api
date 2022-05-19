import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPassword1652966672541 implements MigrationInterface {
  name = 'UserPassword1652966672541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
  }
}
