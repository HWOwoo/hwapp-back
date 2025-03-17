import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { HotDeal } from 'src/crawl/model/entity/crawl.deal.entity';
import { BoardRepository } from './board.repository';
import { BoardDeals } from './entity/board.model.entity';
import { BoardApartRepository } from './board.apart.repository';


@Module({
    imports: [TypeOrmModule.forFeature([HotDeal, BoardDeals])],
    controllers: [BoardController],
    providers: [BoardService,BoardRepository, BoardApartRepository],
    exports: [BoardService, BoardRepository, BoardApartRepository],
})
export class BoardModule {}
