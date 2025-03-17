import { Inject, Injectable } from "@nestjs/common";
import { BoardService } from "./board.service";
import { DataSource, Repository } from "typeorm";
import { BoardDeals } from "./entity/board.model.entity";

@Injectable()
export class BoardApartRepository extends Repository<BoardDeals> {
    constructor (private readonly board : DataSource) {
        super(BoardDeals, board.createEntityManager());
    }

        async createBoardlist (deal) {
            await this.save(deal);
            console.log('✅: ${deal.title}')
        }
}