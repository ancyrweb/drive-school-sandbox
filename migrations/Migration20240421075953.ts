import { Migration } from '@mikro-orm/migrations';
import { Argon2Strategy } from '../src/modules/auth/application/services/password-strategy/argon2-strategy.js';

export class Migration20240421075953 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "admins" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "admins_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "apikeys" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "value" varchar(255) not null, constraint "apikeys_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "apikeys" add constraint "apikeys_value_unique" unique ("value");',
    );

    this.addSql(
      'create table "instructors" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "instructors_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "students" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "students_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "users" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email_address" varchar(255) not null, "password" varchar(255) not null, "apikey_id" varchar(255) not null, "account" jsonb not null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_address_unique" unique ("email_address");',
    );
    this.addSql(
      'alter table "users" add constraint "users_apikey_id_unique" unique ("apikey_id");',
    );

    this.addSql(
      'alter table "users" add constraint "users_apikey_id_foreign" foreign key ("apikey_id") references "apikeys" ("id") on update cascade;',
    );

    const password = await new Argon2Strategy().hash('azerty123');

    this.addSql(
      `INSERT INTO apikeys (id, created_at, updated_at, value) VALUES ('1', NOW(), NOW(), 'apikey')`,
    );

    this.addSql(
      `INSERT INTO users (id, created_at, updated_at, email_address, password, apikey_id, account) VALUES ('1', NOW(), NOW(), 'contact@ancyracademy.fr', '${password}', '1', '{"type": "admin", "id": "1"}')`,
    );

    this.addSql(
      `INSERT INTO admins (id, created_at, updated_at, first_name, last_name) VALUES ('1', NOW(), NOW(), 'anthony', 'cyrille')`,
    );
  }
}
