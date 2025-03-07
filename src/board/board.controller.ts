import { Controller, Get } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {

    constructor(private readonly boardService: BoardService) {}

    @Get('all')
    async getAllDeal(limit: number, page: number = 1) {
        return this.boardService.getAllDeal(limit, page);
    }

}
