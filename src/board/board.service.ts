import { Injectable } from '@nestjs/common';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
    constructor(
        private readonly boardRepositiory: Repository<HotDeal>,
    ) {}
    

}
