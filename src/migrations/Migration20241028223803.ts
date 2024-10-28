import { Migration } from '@mikro-orm/migrations';

export class Migration20241028223803 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null);`);

    this.addSql(`create table "refresh_token_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "value" varchar(255) not null, "user_id" int not null);`);

    this.addSql(`create table "blur_element_entity" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "url" varchar(255) null, "css" varchar(255) null, "xpath" varchar(255) null, "user_id" int not null);`);

    this.addSql(`alter table "refresh_token_entity" add constraint "refresh_token_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);

    this.addSql(`alter table "blur_element_entity" add constraint "blur_element_entity_user_id_foreign" foreign key ("user_id") references "user_entity" ("id") on update cascade;`);
  }

}
