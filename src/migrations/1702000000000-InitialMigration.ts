import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1702000000000 implements MigrationInterface {
  name = 'InitialMigration1702000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT '1',
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "UQ_users_login" UNIQUE ("login"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create artists table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL,
        CONSTRAINT "PK_artists_id" PRIMARY KEY ("id")
      )
    `);

    // Create albums table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums_id" PRIMARY KEY ("id")
      )
    `);

    // Create tracks table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks_id" PRIMARY KEY ("id")
      )
    `);

    // Create favorites table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" SERIAL NOT NULL,
        "entityId" uuid NOT NULL,
        "entityType" character varying NOT NULL,
        CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_favorites_entityType" CHECK ("entityType" IN ('artist', 'album', 'track'))
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "albums"
      ADD CONSTRAINT "FK_albums_artistId"
      FOREIGN KEY ("artistId")
      REFERENCES "artists"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "tracks"
      ADD CONSTRAINT "FK_tracks_artistId"
      FOREIGN KEY ("artistId")
      REFERENCES "artists"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "tracks"
      ADD CONSTRAINT "FK_tracks_albumId"
      FOREIGN KEY ("albumId")
      REFERENCES "albums"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_albums_artistId" ON "albums" ("artistId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_tracks_artistId" ON "tracks" ("artistId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_tracks_albumId" ON "tracks" ("albumId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_favorites_entityId" ON "favorites" ("entityId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_favorites_entityId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tracks_albumId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tracks_artistId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_albums_artistId"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT IF EXISTS "FK_tracks_albumId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT IF EXISTS "FK_tracks_artistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT IF EXISTS "FK_albums_artistId"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tracks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
