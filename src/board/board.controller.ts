import { Controller, Get, Query } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {

    constructor(private readonly boardService: BoardService) {}


    @Get('all')
    async getAllDeal(
        @Query('limit') limit?: string, 
        @Query('page') page?: string, 
        @Query('site') site?: string 
    ) {
        const parsedLimit = limit ? parseInt(limit, 10) : 10; // 기본값 10 설정
        const parsedPage = page ? parseInt(page, 10) : 1; // 기본값 1 설정
        return this.boardService.getAllDeal(parsedLimit, parsedPage, site);
    }
    
    @Get('count')
    async getAllDealCount(
        @Query('site') site?: string
    ) {
        const count = await this.boardService.getAllDealCount(site);
        return { count };
    }

}
