import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlModule } from './crawl/crawl.module';

@Module({
  imports: [CrawlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
