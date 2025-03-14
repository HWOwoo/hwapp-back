import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('board_deals')
export class BoardDeals {
    @Column({ type: 'int', generated: 'increment' }) // 자동증가 ( pk아님 )
    id : number;

    @Column()
    creater : string;

    @Column()
    title : string;
    
    @PrimaryColumn()
    link : string;

    @Column()
    price : string;

    @Column()
    createAt: string;
}