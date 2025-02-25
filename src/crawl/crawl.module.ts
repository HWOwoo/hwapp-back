import { Module } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { CrawlController } from './crawl.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotDeal } from './model/entity/crawl.deal.entity';
import { CrawlRepository } from './crawl.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HotDeal])],
  providers: [CrawlService, CrawlRepository],
  controllers: [CrawlController]
})
export class CrawlModule {}
