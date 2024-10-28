import { Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class RefreshTokenEntity extends BaseEntity {
    @Property()
    public value: string;

    @ManyToOne(() => UserEntity)
    public user: UserEntity;
}
