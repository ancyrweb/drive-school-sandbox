import { Migration } from '@mikro-orm/migrations';

export class Migration20240402041746 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "instructor" ("id" varchar(36) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "instructor_pkey" primary key ("id"));');
  }

}
