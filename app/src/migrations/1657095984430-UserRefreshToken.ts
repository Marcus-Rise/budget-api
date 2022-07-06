import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefreshToken1657095984430 implements MigrationInterface {
  name = 'UserRefreshToken1657095984430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "user_id" TO "userId"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "refresh_token" RENAME COLUMN "userId" TO "user_id"`);
  }
}
