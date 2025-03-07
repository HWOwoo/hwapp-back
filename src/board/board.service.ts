import { Injectable } from '@nestjs/common';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
    constructor(
        private readonly boardRepositiory: Repository<HotDeal>,
    ) {}

    // 전체 목록 조회
    async getAllDeal(limit: number, page: number = 1):Promise<HotDeal[]> {
        return await this.boardRepositiory.find({
            take: limit,
            skip: limit * (page - 1),
            order: {
                createAt: 'DESC',
            },
        });
    }

}
