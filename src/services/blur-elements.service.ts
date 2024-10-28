import { Injectable, NotFoundException } from "@nestjs/common";
import { BlurElementResponseDto } from "../common/DTOs/blur-elements/blur-element-response.dto";
import { EntityManager } from "@mikro-orm/postgresql";
import { BlurElementEntity } from "../entities/blur-elements.entity";
import { CreateElementRequestDto } from "../common/DTOs/blur-elements/create-element-request.dto";
import { UserEntity } from "../entities/user.entity";
import { UpdateElementRequestDto } from "../common/DTOs/blur-elements/update-element-request.dto";
import { GetElementsRequestDto } from "../common/DTOs/blur-elements/get-elements-request.dto";

@Injectable()
export class BlurElementsService {
    constructor(
        private readonly _entityManager: EntityManager
    ) {}

    public async getElementsByUserId(userId: number, dto: GetElementsRequestDto): Promise<BlurElementResponseDto[]> {
        const where = {
            user: { id: userId},
            url: {}
        }

        if (dto.url != null) {
            where.url = { $like: `%${dto.url ?? ""}%`};
        }

        const entities = await this._entityManager.findAll(BlurElementEntity, { 
            where,
            orderBy: { createdAt: "desc" }
        });

        return entities.map((x) => ({
            id: x.id,
            url: x.url,
            css: x.css,
            xpath: x.xpath
        }))
    }

    public async createElement(userId: number, dto: CreateElementRequestDto): Promise<void> {
        const user = await this._entityManager.findOneOrFail(UserEntity, { id: userId });
        const element = new BlurElementEntity();

        element.user = user;
        element.url = dto.url;
        element.css = dto.css;
        element.xpath = dto.xpath

        await this._entityManager.insert(element);
        await this._entityManager.flush();
    }

    public async updateElement(elementId: number, userId: number, dto: UpdateElementRequestDto): Promise<void> {
        const element = await this._entityManager.findOne(BlurElementEntity, { id: elementId, user: { id: userId }});

        if (element == null) {
            throw new NotFoundException("Element was not found")
        }

        element.url = dto.url;
        element.css = dto.css;
        element.xpath = dto.xpath

        await this._entityManager.flush();
    }

    public async deleteElement(elementId: number, userId: number): Promise<void> {
        const element = await this._entityManager.findOne(BlurElementEntity, { id: elementId, user: { id: userId }});

        if (element == null) {
            throw new NotFoundException("Element was not found")
        }

        await this._entityManager.remove(element);
        await this._entityManager.flush();
    }
}
