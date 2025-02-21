import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import { CrawlPost } from './model/crawl.model';
import { HotDealPost } from './model/crawl.arca.hotdeal.model';

@Injectable()
export class CrawlService {

    async srcapWeb(url: string) {
        // 브라우저 실행
        const web = await puppeteer.launch({headless: true});
        const page = await web.newPage();

        await page.goto(url, {waitUntil: 'domcontentloaded'});
        
        const posts: CrawlPost[] = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('td.gall_tit.ub-word')).map(td => {
              const titleElement = td.querySelector('a'); // 제목
              const replyElement = td.querySelector('.reply_num'); // 댓글 개수
              const linkElement = titleElement?.getAttribute('href') || '#'; // 링크
          
              return {
                title: titleElement?.textContent?.trim() ?? 'No Title',
                link: linkElement.startsWith('http') ? linkElement : `https://gall.dcinside.com${linkElement}`,
                replies: replyElement && replyElement.textContent ? replyElement.textContent.trim() : '0' // 기본값 설정
              };
            });
          });
          
        await web.close();
        return { posts };
    }

    async scrapArcaDeal(url: string) : Promise<HotDealPost[]> {
            // 브라우저 실행
            const StealthPlugin = require('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());

            const web = await puppeteer.launch({
                headless: true
            });
            const page = await web.newPage();

            await page.goto(url, { waitUntil: 'networkidle2' });

            const deals: HotDealPost[] = await page.evaluate(() => {
                const baseURL = 'https://arca.live';
                const rows = document.querySelectorAll('.vrow.hybrid');
                // 브라우저 콘솔 로그를 Node.js 콘솔로 출력

                if (rows.length === 0) {
                    return [{ title: 'No Data Found', link: '#', time: 'No Time', price: 'No Price' }];
                }
            
                return Array.from(rows).map(row => {
                    const titleElement = row.querySelector('a.title.hybrid-title');
                    const timeElement = row.querySelector('span.vcol.col-time time');
                    const priceElement = row.querySelector('span.deal-price');
            
                    return {
                        title: titleElement?.textContent?.trim() ?? 'No Title',
                        link: titleElement?.getAttribute('href') ? baseURL + titleElement.getAttribute('href') : '#',
                        time: timeElement?.getAttribute('datetime') ?? 'No Time',
                        price: priceElement?.textContent?.trim() ?? 'No Price'
                    };
                });
            });
            

    await web.close();
    return deals;
    }

}
