import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1748789229219 implements MigrationInterface {
    name = 'TestMigration1748789229219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "chain_id" integer NOT NULL, "address" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_types" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_561828e0f71266abfba72866f7d" UNIQUE ("name"), CONSTRAINT "PK_5b568d39e833de527bca6d2a64d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "contract_type_id" integer NOT NULL, "chain_id" integer NOT NULL, "block_number" integer NOT NULL, "status" character varying NOT NULL, "address" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL, "payment_transaction_hash" character varying NOT NULL, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_4e1de36dfe48eb55999a95e1056" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_68979013900fe56571594d823b4" FOREIGN KEY ("contract_type_id") REFERENCES "contract_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_68979013900fe56571594d823b4"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_4e1de36dfe48eb55999a95e1056"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TABLE "contract_types"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
