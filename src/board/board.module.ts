import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { BoardRepository } from './board.repository';


@Module({
    imports: [TypeOrmModule.forFeature([HotDeal])],
    controllers: [BoardController],
    providers: [BoardService,BoardRepository],
    exports: [BoardService, BoardRepository],
})
export class BoardModule {}
