import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateElementRequestDto {
    @IsOptional()
    @IsString()
    @IsUrl()
    @ApiProperty()
    public url?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    public css?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    public xpath?: string;
}