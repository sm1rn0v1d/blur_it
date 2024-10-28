import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/gwards/auth.gward";
import { BlurElementsService } from "../services/blur-elements.service";
import { BlurElementResponseDto } from "../common/DTOs/blur-elements/blur-element-response.dto";
import { CreateElementRequestDto } from "../common/DTOs/blur-elements/create-element-request.dto";
import { UpdateElementRequestDto } from "../common/DTOs/blur-elements/update-element-request.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GetElementsRequestDto } from "../common/DTOs/blur-elements/get-elements-request.dto";

@Controller("elements")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BlurElementsController {
    constructor(private readonly _blurElementsService: BlurElementsService) {}

    @Get()
    public async getElements(@Request() request, @Query() dto: GetElementsRequestDto): Promise<BlurElementResponseDto[]> {
        const userId = request.user.sub;
        return this._blurElementsService.getElementsByUserId(userId, dto);
    }

    @Post()
    public async createElement(@Request() request, @Body() dto: CreateElementRequestDto): Promise<void> {
        const userId = request.user.sub;
        return this._blurElementsService.createElement(userId, dto);
    }

    @Put(":elementId")
    public async updateElement(@Request() request, @Param("elementId") elementId: number, @Body() dto: UpdateElementRequestDto): Promise<void> {
        const userId = request.user.sub;
        return this._blurElementsService.updateElement(elementId, userId, dto);
    }

    @Delete(":elementId")
    public async deleteElement(@Request() request, @Param("elementId") elementId: number): Promise<void> {
        const userId = request.user.sub;
        return this._blurElementsService.deleteElement(elementId, userId);
    }
}
