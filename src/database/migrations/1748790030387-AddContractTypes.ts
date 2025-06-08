import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractTypes1748790030387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO contract_types (id, name) VALUES 
            (1, 'simple_contract'),
            (2, 'erc-20'),
            (3, 'nft')
            ON CONFLICT (id) DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM contract_types;
        `);
  }
}
