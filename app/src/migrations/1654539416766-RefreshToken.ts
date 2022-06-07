import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshToken1654539416766 implements MigrationInterface {
  name = 'RefreshToken1654539416766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "is_revoked" boolean NOT NULL, "expires" TIMESTAMP NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
