import { Migration } from '@mikro-orm/migrations';

export class Migration20240419012802 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "apikey_entity" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "value" varchar(255) not null, constraint "apikey_entity_pkey" primary key ("id"));');
    this.addSql('alter table "apikey_entity" add constraint "apikey_entity_value_unique" unique ("value");');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email_address" varchar(255) not null, "password" varchar(255) not null, "role" varchar(32) not null, "api_key_id" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_address_unique" unique ("email_address");');
    this.addSql('alter table "user" add constraint "user_api_key_id_unique" unique ("api_key_id");');

    this.addSql('create table "student" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_id" varchar(255) not null, constraint "student_pkey" primary key ("id"));');
    this.addSql('alter table "student" add constraint "student_user_id_unique" unique ("user_id");');

    this.addSql('create table "instructor" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "user_id" varchar(255) not null, constraint "instructor_pkey" primary key ("id"));');
    this.addSql('alter table "instructor" add constraint "instructor_user_id_unique" unique ("user_id");');

    this.addSql('create table "admin" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" varchar(255) not null, constraint "admin_pkey" primary key ("id"));');
    this.addSql('alter table "admin" add constraint "admin_user_id_unique" unique ("user_id");');

    this.addSql('alter table "user" add constraint "user_api_key_id_foreign" foreign key ("api_key_id") references "apikey_entity" ("id") on update cascade;');

    this.addSql('alter table "student" add constraint "student_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "instructor" add constraint "instructor_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "admin" add constraint "admin_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}