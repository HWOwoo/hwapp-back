import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(HotDeal)
        private readonly boardRepositiory: Repository<HotDeal>,
    ) {}

    // 전체 목록 조회
    async getAllDeal(limit: number, page: number = 1, site?: string): Promise<HotDeal[]> {
        const take = Number(limit) || 10;
        const skip = Number(page) > 1 ? take * (Number(page) - 1) : 0;
        
        // '통합'이면 site 필터링을 적용하지 않음
        const whereCondition = site && site !== '통합' ? { site } : {};
    
        return await this.boardRepositiory.find({
            where: whereCondition,
            take,
            skip,
            order: {
                createAt: 'DESC',
            },
        });
    }
    
    async getAllDealCount(site?: string): Promise<number> {
        
        const whereCondition = site && site !== '통합' ? { site } : {};
        return await this.boardRepositiory.count({ where: whereCondition });
        
    }

}
