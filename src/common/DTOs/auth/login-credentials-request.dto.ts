import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginCredentialsRequestDto {
    @IsString()
    @IsEmail()
    @Transform(({ value }) => (value as string).toLowerCase())
    @ApiProperty()
    public email: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    public password: string;
}