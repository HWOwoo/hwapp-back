import { Repository } from "typeorm";
import { HotDeal } from "./model/entity/crawl.deal.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CrawlRepository extends Repository<HotDeal> {
    async saveDeal(deal : HotDeal) : Promise<void> {
        try {
            await this.save(deal);
            console.log('✅: ${deal.title}')
        } catch (error) {
            if ( error.code === '23505') {
                console.log('❌: ${deal.title}')
            } else {
                console.log('❌: ${deal.title}')
            }
        }
    }
}