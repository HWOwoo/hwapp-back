import { Repository } from 'typeorm';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BoardDeals } from './entity/board.model.entity';

@Injectable()
export class BoardRepository extends Repository<HotDeal> {
    constructor(private readonly dataSource: DataSource) {
        super(HotDeal, dataSource.createEntityManager());
    }

    async readDeal(limit: number, page: number = 1): Promise<HotDeal[]> {
        return await this.find({
            take: limit,
            skip: limit * (page - 1),
            order: {
                createAt: 'DESC',
            },
        });
    }

    async readAiContent(link : string) {
        return await this.findOne({
            where : {link},
            select : ["aiContent"],
        });
    }

    async updateContent(link: string, aiContent: string) {
        await this.update({link}, {aiContent});
        console.log(': ${aiContent}')
    }

    async createBoard(deal : BoardDeals) {
        await this.save(deal);
        console.log(': ${deal.title}')
    }
}
