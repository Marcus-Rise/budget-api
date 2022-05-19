import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLoginUnique1652982894855 implements MigrationInterface {
  name = 'UserLoginUnique1652982894855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user" ("login") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
  }
}
