import { Migration } from '@mikro-orm/migrations';
import { Argon2Strategy } from '../src/modules/auth/application/services/password-strategy/argon2-strategy.js';

export class Migration20240418063201 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email_address" varchar(255) not null, "password" varchar(255) not null, "role" varchar(32) not null, "api_key" varchar(255) not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_address_unique" unique ("email_address");',
    );
    this.addSql(
      'alter table "user" add constraint "user_api_key_unique" unique ("api_key");',
    );

    const argon2strategy = new Argon2Strategy();
    const password = await argon2strategy.hash('azerty123');

    this.addSql(
      `insert into "user" (id, created_at, updated_at, email_address, password, role, api_key) values ('1', '2024-04-18T06:32:01.000Z', '2024-04-18T06:32:01.000Z', 'anthony@gmail.com', '${password}', 'ADMIN', '123456789');`,
    );
  }
}
