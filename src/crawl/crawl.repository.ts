import { Repository } from "typeorm";
import { HotDeal } from "./model/entity/crawl.deal.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CrawlRepository extends Repository<HotDeal> {
    async saveDeal(deal : HotDeal) : Promise<void> {
        try {
            await this.save(deal);
            console.log('✅ 저장 완료 : ${deal.title}')
        } catch (error) {
            if ( error.code === '23505') {
                console.log('❌ 중복된 데이터 : ${deal.title}')
            } else {
                console.log('❌ 저장 실패 : ${deal.title}')
            }
        }
    }


}