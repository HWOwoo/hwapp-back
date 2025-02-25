import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlModule } from './crawl/crawl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotDeal } from './crawl/model/entity/crawl.deal.entity';

@Module({
  imports: [
    CrawlModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // PostgreSQL이 실행 중인 호스트
      port: 5432, // 기본 포트
      username: 'hwappowner', // 위에서 생성한 계정
      password: 'gudtjr32', // 위에서 설정한 비밀번호
      database: 'hwapp_db', // 연결할 DB
      entities: [HotDeal], // 사용할 엔터티 등록
      synchronize: true, // 애플리케이션 시작 시 자동으로 테이블 생성 (개발 환경에서만 true)
      logging: true, // SQL 실행 로그 확인
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
