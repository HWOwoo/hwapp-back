import { Controller, Get, Query } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Controller('crawl')
export class CrawlController {
    constructor(private readonly crawlService: CrawlService) {}

    @Get('scrap')
    async scrapAndSave() {
        await this.crawlService.scrapAndSave();
        return { message: '크롤링 후 데이터 저장 완료!' };
    }

    @Get('arca')
    async getArcaDeal(@Query('url') encodedUrl : string) {
        if (!encodedUrl) {
            return { error : 'NOT URL'}
        }

        const url = decodeURIComponent(encodedUrl); 
        return this.crawlService.scrapArcaDeal(url);
    }

    @Get('ppomppu')
    async getPPomppuDeal(@Query('url') encodedUrl : string) {
        if (!encodedUrl) {
            return { error : 'NOT URL'}
        }

        const url = decodeURIComponent(encodedUrl); 
        return this.crawlService.scrapPPomppuDeal(url);
    }

    @Get('quasar')
    async getQuasarDeal(@Query('url') encodedUrl : string) {
        if (!encodedUrl) {
            return { error : 'NOT URL'}
        }

        const url = decodeURIComponent(encodedUrl); 
        return this.crawlService.scrapQuasarDeal(url);
    }

}
