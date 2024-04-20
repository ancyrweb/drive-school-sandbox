import { Migration } from '@mikro-orm/migrations';

export class Migration20240420055853 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "sql_apikey" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "value" varchar(255) not null, constraint "sql_apikey_pkey" primary key ("id"));');
    this.addSql('alter table "sql_apikey" add constraint "sql_apikey_value_unique" unique ("value");');

    this.addSql('create table "sql_instructor" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "sql_instructor_pkey" primary key ("id"));');

    this.addSql('create table "sql_user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email_address" varchar(255) not null, "password" varchar(255) not null, "apikey_id" varchar(255) not null, "account" jsonb not null, constraint "sql_user_pkey" primary key ("id"));');
    this.addSql('alter table "sql_user" add constraint "sql_user_email_address_unique" unique ("email_address");');
    this.addSql('alter table "sql_user" add constraint "sql_user_apikey_id_unique" unique ("apikey_id");');

    this.addSql('alter table "sql_user" add constraint "sql_user_apikey_id_foreign" foreign key ("apikey_id") references "sql_apikey" ("id") on update cascade;');
  }

}
