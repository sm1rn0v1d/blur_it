import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { AuthTokensResponseDto } from "../common/DTOs/auth/auth-tokens-response.dto";
import { LoginCredentialsRequestDto } from "../common/DTOs/auth/login-credentials-request.dto";
import { RefreshToknRequestDto } from "../common/DTOs/auth/refresh-token-request.dto";
import { LogoutRequestDto } from "../common/DTOs/auth/logout-request.dto";
import { AuthGuard } from "../common/gwards/auth.gward";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post("sign-up")
    public async signUp(@Body() dto: LoginCredentialsRequestDto): Promise<AuthTokensResponseDto> {
        return this._authService.signUp(dto);
    }

    @Post("sign-in")
    public async signIn(@Body() dto: LoginCredentialsRequestDto): Promise<AuthTokensResponseDto> {
        return this._authService.signIn(dto);
    }
 
    @Post("refresh")
    public async refreshTokens(@Body() dto: RefreshToknRequestDto): Promise<AuthTokensResponseDto> {
        return this._authService.refreshTokens(dto);
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    public async logout(@Request() request, @Body() dto: LogoutRequestDto): Promise<void> {
        const userId = request.user.sub;
        return this._authService.logout(userId, dto);
    }
}