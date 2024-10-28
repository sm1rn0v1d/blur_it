import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class BlurElementEntity extends BaseEntity {
    @Property({ nullable: true })
    public url?: string;

    @Property({ nullable: true })
    public css?: string;

    @Property({ nullable: true })
    public xpath?: string;

    @ManyToOne(() => UserEntity)
    public user: UserEntity;
}