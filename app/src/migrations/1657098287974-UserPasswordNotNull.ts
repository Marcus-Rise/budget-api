import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPasswordNotNull1657098287974 implements MigrationInterface {
  name = 'UserPasswordNotNull1657098287974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
  }
}
