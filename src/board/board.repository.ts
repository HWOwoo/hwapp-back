import { Repository } from 'typeorm';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BoardRepository extends Repository<HotDeal> {
    async readDeal(limit: number, page: number = 1): Promise<HotDeal[]> {
        return await this.find({
            take: limit,
            skip: limit * (page - 1),
            order: {
                createAt: 'DESC',
            },
        });
    }
}
