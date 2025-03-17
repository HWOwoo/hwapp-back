import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { HotDeal } from './model/entity/crawl.deal.entity';
import { Repository } from 'typeorm';
@Injectable()
export class CrawlService {
    constructor (
        @InjectRepository(HotDeal)
        private readonly crawlRepository: Repository<HotDeal>,
    ) {}

    async scrapAndSave() {
        console.log('[크롤링 시작] 데이터 가져오는 중...');

        // 크롤링 실행
        const arcaDeals = await this.scrapArcaDeal(decodeURIComponent('https://arca.live/b/hotdeal'));
        const ppomppuDeals = await this.scrapPPomppuDeal(decodeURIComponent('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu'));
        const quasarDeals = await this.scrapQuasarDeal(decodeURIComponent('https://quasarzone.com/bbs/qb_saleinfo'));

        // 크롤링한 데이터를 합쳐서 DB에 저장
        const allDeals: HotDeal[] = [...arcaDeals, ...ppomppuDeals, ...quasarDeals];

        if (allDeals.length > 0) {
            await this.saveDeals(allDeals);
            console.log('[크롤링 완료] 데이터가 성공적으로 저장되었습니다!');
        } else {
            console.warn('[크롤링 결과] 저장할 데이터가 없습니다.');
        }
    }
    
    async saveDeals(deals: HotDeal[]): Promise<void> {
        for (const deal of deals) {
            try {
                await this.crawlRepository.save(deal);
            } catch (error) {
                if (error.code === '23505') {
                    console.warn(`중복된 데이터: ${deal.title}`);
                } else {
                    console.error('DB 저장 오류:', error);
                }
            }
        }
    }

    async scrapArcaDeal(url: string) : Promise<HotDeal[]> {

            // 브라우저 실행
            const StealthPlugin = require('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());

            const web = await puppeteer.launch({
                headless: true
            });
            const page = await web.newPage();

             // ✅ arclive에서 크롤링할 경우 자주 발생하는 No Data Found 오류로 인한 User-Agent 설정
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/',
                'Upgrade-Insecure-Requests': '1',
            });
            await page.goto(url, { waitUntil: 'networkidle2' });

            const deals: HotDeal[] = await page.evaluate(() => {
                const baseURL = 'https://arca.live';
                const rows = document.querySelectorAll('.vrow.hybrid');

                if (rows.length === 0) {
                    return [{ id: 0 ,site: 'Arca', title: 'No Data Found', link: '#', price: 'No Price', createAt: '-' }];
                }
            
                return Array.from(rows).map(row => {
                    const titleElement = row.querySelector('a.title.hybrid-title');
                    const timeElement = row.querySelector('span.vcol.col-time time');
                    const priceElement = row.querySelector('span.deal-price');

                    return {
                        id: 0,
                        title: titleElement?.textContent?.trim() ?? 'No Title',
                        link: titleElement?.getAttribute('href') ? baseURL + titleElement.getAttribute('href') : '#',
                        createAt: timeElement?.getAttribute('datetime') || 'No Time',
                        price: priceElement?.textContent?.trim() ?? 'No Price',
                        site: 'Arca'
                    };
                }).filter(deal => deal.title !== 'No Title');
            });
            

        await web.close();
        return deals.map(deal => ({
            ...deal,
            createAt: convertRelativeTimeToDate(deal.createAt)
        }));
    }

     async scrapPPomppuDeal(url: string) : Promise<HotDeal[]> {
            // 브라우저 실행
            const StealthPlugin = require('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());

            const web = await puppeteer.launch({
                headless: true
            });
            const page = await web.newPage();

            await page.goto(url, { waitUntil: 'networkidle2' });

            const deals: HotDeal[] = await page.evaluate(() => {
                const baseURL = 'https://www.ppomppu.co.kr/zboard/';
                const rows = document.querySelectorAll('tr.baseList');

                if (rows.length === 0) {
                    return [{ id: 0, title: 'No Data Found', link: '#', createAt: 'No Time', price: 'No Price', site: 'PPomppu' }];
                }
            
                return Array.from(rows).map(row => {
                    const titleElement = row.querySelector('a.baseList-title span'); // 제목
                    const linkElement = row.querySelector('a.baseList-title'); // 링크
                    const timeElement = row.querySelector('td.baseList-space[title]'); // ✅ 상위 요소에서 title 속성 가져오기
                
                    // 가격 정보 추출 (제목에서 정규식으로 숫자 찾기)
                    const titleText = titleElement?.textContent?.replace(/\s+/g, ' ').trim() ?? 'No Title';
                    const priceMatch = titleText.match(/(\d{1,3}(?:,\d{3})*(?:원|\$))/); // 숫자 + "원" 또는 "$"
                    const price = priceMatch ? priceMatch[0] : 'No Price';
                
                    // ✅ title 속성에서 날짜 가져오기 (예: "25.02.26 13:56:09")
                    const rawTime = timeElement?.getAttribute('title') ?? 'No Time';
                    const link = linkElement?.getAttribute('href') ?? '#';

                    if (!link.startsWith('view.php?')) {
                        return null; // 잘못된 링크는 제외
                    }
                
                    return {
                        id: 0,
                        title: titleText,
                        link: linkElement?.getAttribute('href') ? baseURL + linkElement.getAttribute('href') : '#',
                        createAt: rawTime,
                        price: price,
                        site: 'PPomppu'
                    };
                }).filter(deal => deal !== null);
            });
            

        await web.close();
        return deals.map(deal => ({
            ...deal,
            createAt: convertRelativeTimeToDate(deal.createAt)
        }));
    }

    async scrapQuasarDeal(url: string) : Promise<HotDeal[]> {
        // 브라우저 실행
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());

        const web = await puppeteer.launch({
            headless: true
        });
        const page = await web.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const deals: HotDeal[] = await page.evaluate(() => {
            const baseURL = 'https://quasarzone.com'; // 퀘이사존 기본 URL
            const rows = document.querySelectorAll('.market-info-type-list tbody tr'); // 모든 핫딜 행 가져오기
        
            if (rows.length === 0) {
                return [{ id : 0, title: 'No Data Found', link: '#', createAt: 'No Time', price: 'No Price', site: 'Quasar' }];
            }

            return Array.from(rows).map(row => {
                const titleElement = row.querySelector('a.subject-link'); // 제목
                const linkElement = row.querySelector('a.subject-link'); // 링크
                const priceElement = row.querySelector('.text-orange'); // 가격
                const timeElement = row.querySelector('.date'); // 날짜

                return {
                    id: 0,
                    title: titleElement?.textContent?.replace(/\s+/g, ' ').trim() ?? 'No Title',
                    link: linkElement?.getAttribute('href') ? baseURL + linkElement.getAttribute('href') : '#',
                    price: priceElement?.textContent?.trim() ?? 'No Price',
                    site: 'Quasar',
                    createAt: timeElement?.textContent?.trim() ?? 'No Time'
                };
            }).filter(deal => deal.title !== 'No Title');
        });
        

    await web.close();
    return deals.map(deal => ({
        ...deal,
        createAt: convertRelativeTimeToDate(deal.createAt)
    }));
}

}

function convertRelativeTimeToDate(timeText: string): string {
    const now = new Date(); // 현재 시간 (크롤링 실행 시점)
    let convertedDate: Date;

    // ⏰ 상대적인 시간 (ex: "6분 전", "2시간 전", "15시간 전")
    if (timeText.includes('분 전')) {
        const minutes = parseInt(timeText.replace('분 전', '').trim(), 10);
        convertedDate = new Date(now.getTime() - minutes * 60 * 1000);
    } else if (timeText.includes('시간 전')) {
        const hours = parseInt(timeText.replace('시간 전', '').trim(), 10);
        convertedDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
    } 

    // ⏰ 당일 시간 (ex: "11:09:57")
    else if (timeText.match(/^\d{2}:\d{2}:\d{2}$/)) {
        const [hours, minutes, seconds] = timeText.split(':').map(num => parseInt(num, 10));
        convertedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    }
    
    // 📅 날짜 형식 (ex: "02-24") - 같은 연도의 월-일 데이터 처리
    else if (timeText.match(/^\d{2}-\d{2}$/)) {
        const [month, day] = timeText.split('-').map(num => parseInt(num, 10));
        const year = now.getFullYear(); // 올해 연도로 설정
        convertedDate = new Date(year, month - 1, day);
    }

    // 📅 날짜 형식 추가 (ex: "25.02.26 13:56:09" → "2025-02-26 13:56:09")
    else if (timeText.match(/^\d{2}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/)) {
        const [datePart, timePart] = timeText.split(' '); // 날짜와 시간 분리
        const [year, month, day] = datePart.split('.').map(num => parseInt(num, 10)); // 일, 월, 년 분리
        const fullYear = 2000 + year; // 2자리 연도를 4자리로 변환 (ex: 25 → 2025) 
    
        // ✅ new Date(year, month - 1, day) 사용 (월은 0부터 시작)
        convertedDate = new Date(fullYear, month - 1, day);
    
        const [hours, minutes, seconds] = timePart.split(':').map(num => parseInt(num, 10));
        convertedDate.setHours(hours, minutes, seconds);
        convertedDate.setHours(convertedDate.getHours() - convertedDate.getTimezoneOffset() / 60);
    }


    // 🌍 ISO 8601 날짜 형식 (ex: "2025-02-25T05:06:01.000Z") - UTC → KST 변환
    else if (timeText.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
        convertedDate = new Date(timeText); // UTC 기준으로 날짜 객체 생성
        convertedDate = new Date(convertedDate.getTime() + 9 * 60 * 60 * 1000); // ✅ UTC+9 (KST) 변환
    }

    // 🛑 잘못된 입력 처리
    else {
        return 'Invalid Date';
    }

    return convertedDate.toISOString().replace('T', ' ').split('.')[0]; // 'YYYY-MM-DD HH:mm:ss' 형식
}

