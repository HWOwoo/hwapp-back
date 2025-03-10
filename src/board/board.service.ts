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
    async getAllDeal(limit: number, page: number = 1): Promise<HotDeal[]> {
        // limit, page가 유효한 숫자인지 확인
        const take = Number(limit) || 10; // 기본값 10 설정 (limit가 NaN이면 10)
        const skip = Number(page) > 1 ? take * (Number(page) - 1) : 0; // page가 1보다 작으면 0으로 설정
    
        return await this.boardRepositiory.find({
            take,
            skip,
            order: {
                createAt: 'DESC',
            },
        });
    }
    

}
