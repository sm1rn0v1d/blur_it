import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUrl } from "class-validator";

export class GetElementsRequestDto {
    @IsOptional()
    @IsUrl()
    @ApiProperty({ required: false })
    public url: string;
}