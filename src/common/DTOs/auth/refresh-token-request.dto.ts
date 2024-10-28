import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsString } from "class-validator";

export class RefreshToknRequestDto {
    @IsString()
    @IsJWT()
    @ApiProperty()
    public accessToken: string;

    @IsString()
    @ApiProperty()
    public refreshToken: string;
}