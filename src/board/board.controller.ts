import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDeals } from './entity/board.model.entity';
import { BoardApartRepository } from './board.apart.repository';
import { link } from 'fs';

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

    @Post('create')
    async createDeal(@Body() BoardDeals) {
        return this.boardService.createDeal(BoardDeals);
    }

    @Post('updateAi')
    async updateDealContent(
        @Body('link') link : string,
        @Body('aiContent') aiContent : string
    ) {
        await this.boardService.updateAiContent(link, aiContent);
    }

    @Post('readAiContent')
    async readAiContent(
        @Body('link') link : string
    ) {
        return await this.boardService.readAiContent(link);
    }
}
