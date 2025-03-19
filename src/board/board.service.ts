import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Not, Repository } from 'typeorm';
import { BoardDeals } from './entity/board.model.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './entity/dto/create-board.dto.ts';
import { BoardApartRepository } from './board.apart.repository';
@Injectable()
export class BoardService {
    constructor(
        @Inject(BoardRepository)
        private readonly boardRepositiory: BoardRepository,
        @Inject(BoardApartRepository)
        private readonly boardARepositiory: BoardApartRepository
    ) {}
    

    // 전체 목록 조회
    async getAllDeal(limit: number, page: number = 1, site?: string): Promise<HotDeal[]> {
        const take = Number(limit) || 10;
        const skip = Number(page) > 1 ? take * (Number(page) - 1) : 0;
        
        // '통합'이면 site 필터링을 적용하지 않음
        const whereCondition = site && site !== '통합' ? { site } : {};
    
        return await this.boardRepositiory.find({
            where: { ...whereCondition,
                title: Not('No Data Found'), // "No Data Found" 제외
             },
            take,
            skip,
            order: {
                createAt: 'DESC',
            },
        });
    }
    
    // 전체 리스트 조회
    async getAllDealCount(site?: string): Promise<number> {
        
        const whereCondition = site && site !== '통합' ? { site } : {};
        return await this.boardRepositiory.count({ where: whereCondition });
        
    }

    async readAiContent(link: string) {
        return await this.boardRepositiory.readAiContent(link);
    }
    
    // 게시글 생성
    async createDeal(deal: CreateBoardDto): Promise<void> {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        try {
            const board = new BoardDeals();
            board.id = 0;
            board.creater = deal.creater;
            board.title = deal.title;
            board.link = deal.link;
            board.price = deal.price;
            board.createAt =  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            this.boardARepositiory.createBoardlist(board);
            console.log(`${deal.title}`);
        } catch (error) {
        }
    }

    async updateAiContent(link: string, aiContent: string) : Promise<void> {
        const deal = await this.boardRepositiory.findOne({where: {link}});

        if (!deal) {
            throw new Error(`에러`)
        }

        await this.boardRepositiory.updateContent(link, aiContent);
    }


}
