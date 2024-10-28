import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { AuthTokensResponseDto } from "../common/DTOs/auth/auth-tokens-response.dto";
import { RefreshTokenEntity } from "../entities/refresh-token.entity";
import * as uuid from "uuid";
import { LoginCredentialsRequestDto } from "../common/DTOs/auth/login-credentials-request.dto";
import { RefreshToknRequestDto } from "../common/DTOs/auth/refresh-token-request.dto";
import { LogoutRequestDto } from "../common/DTOs/auth/logout-request.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly _entityManager: EntityManager,
        private readonly _jwtService: JwtService
    ) {}

    public async signUp(dto: LoginCredentialsRequestDto): Promise<AuthTokensResponseDto> {
        const existingUser = await this._entityManager.findOne(UserEntity, { email: dto.email });

        if (existingUser != null) {
            throw new BadRequestException(`User with email ${dto.email} already exists`);
        }

        const user = new UserEntity();
        user.email = dto.email;
        user.password = bcrypt.hashSync(dto.password);

        const refreshToken = new RefreshTokenEntity();
        refreshToken.user = user;
        refreshToken.value = uuid.v4();

        await this._entityManager.insert(user);
        await this._entityManager.insert(refreshToken);
        await this._entityManager.flush();

        const payload = { sub: user.id, email: user.email };

        return {
            accessToken: this._jwtService.sign(payload),
            refreshToken: refreshToken.value
        }
    }

    public async signIn(dto: LoginCredentialsRequestDto): Promise<AuthTokensResponseDto> {
        const user = await this._entityManager.findOne(UserEntity, { email: dto.email });

        if (user == null) {
            throw new NotFoundException(`User was not found`);
        }

        const isPasswordMatch = bcrypt.compareSync(dto.password, user.password);
        
        if (!isPasswordMatch) {
            throw new BadRequestException("Passwords doesn't match");
        }

        const refreshToken = new RefreshTokenEntity();
        refreshToken.user = user;
        refreshToken.value = uuid.v4();
        
        await this._entityManager.insert(refreshToken);
        await this._entityManager.flush();

        const payload = { sub: user.id, email: user.email };

        return {
            accessToken: this._jwtService.sign(payload),
            refreshToken: refreshToken.value
        }
    }

    public async refreshTokens(dto: RefreshToknRequestDto): Promise<AuthTokensResponseDto> {
        const payload = this._jwtService.decode(dto.accessToken);
        const userId = payload?.sub;

        if (userId == null) {
            throw new BadRequestException("Invalid access token");
        }

        const user = await this._entityManager.findOne(UserEntity, { id: userId });

        if (user == null) {
            throw new NotFoundException("User was not found");
        }

        const oldRefreshToken = await this._entityManager.findOne(RefreshTokenEntity, {
            user: { id: userId },
            value: dto.refreshToken
        })

        if (oldRefreshToken == null) {
            throw new NotFoundException("Refresh token was not found");
        }

        const newRefreshToken = new RefreshTokenEntity();
        newRefreshToken.user = user;
        newRefreshToken.value = uuid.v4();

        await this._entityManager.remove(oldRefreshToken);
        await this._entityManager.insert(newRefreshToken);
        await this._entityManager.flush();

        const newPayload = { sub: user.id, email: user.email };

        return {
            accessToken: this._jwtService.sign(newPayload),
            refreshToken: newRefreshToken.value
        }
    }

    public async logout(userId: number, dto: LogoutRequestDto): Promise<void> {
        const tokenEntity = await this._entityManager.findOne(RefreshTokenEntity, {
            user: { id: userId },
            value: dto.refreshToken
        });

        if (tokenEntity == null) {
            return;
        }

        await this._entityManager.remove(tokenEntity);
        await this._entityManager.flush();
    }
}
