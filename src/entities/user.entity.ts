import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { RefreshTokenEntity } from "./refresh-token.entity";
import { BlurElementEntity } from "./blur-elements.entity";

@Entity()
export class UserEntity extends BaseEntity {
    @Property()
    public email: string;

    @Property()
    public password: string;

    @OneToMany(() => BlurElementEntity, (element) => element.user, { cascade: [Cascade.REMOVE] })
    public blurElements = new Collection<BlurElementEntity>(this);

    @OneToMany(() => RefreshTokenEntity, (token) => token.user, { cascade: [Cascade.REMOVE]})
    public refreshTokens = new Collection<RefreshTokenEntity>(this);
}