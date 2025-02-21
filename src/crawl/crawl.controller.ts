import { Controller, Get, Query } from '@nestjs/common';
import { CrawlService } from './crawl.service';

@Controller('crawl')
export class CrawlController {
    constructor(private readonly crawlService: CrawlService) {}

    @Get()
    async getWebsite(@Query('url') encodedUrl : string) {
        if (!encodedUrl) {
            return { error : 'NOT URL'}
        }

        const url = decodeURIComponent(encodedUrl); // URL 디코딩
        return this.crawlService.srcapWeb(url);
    }

    @Get('arca')
    async getArcaDeal(@Query('url') encodedUrl : string) {
        if (!encodedUrl) {
            return { error : 'NOT URL'}
        }

        const url = decodeURIComponent(encodedUrl); // URL 디코딩
        return this.crawlService.scrapArcaDeal(url);
    }

}
