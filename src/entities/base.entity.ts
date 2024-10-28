import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ abstract: true })
export class BaseEntity {
    @PrimaryKey()
    public id: number;

    @Property()
    public createdAt = new Date();
  
    @Property({ onUpdate: () => new Date() })
    public updatedAt = new Date();
}