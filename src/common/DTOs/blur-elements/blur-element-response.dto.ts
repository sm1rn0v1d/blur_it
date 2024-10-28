import { ApiProperty } from "@nestjs/swagger";

export class BlurElementResponseDto {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public url?: string;
    @ApiProperty()
    public css?: string;
    @ApiProperty()
    public xpath?: string;
}
