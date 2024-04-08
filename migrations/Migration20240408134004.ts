import { Migration } from '@mikro-orm/migrations';

console.log('found');

export class Migration20240408134004 extends Migration {
  async up(): Promise<void> {
    console.log('run');
    this.addSql(
      'create table "instructor" ("id" varchar(36) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, constraint "instructor_pkey" primary key ("id"));',
    );
  }
}
