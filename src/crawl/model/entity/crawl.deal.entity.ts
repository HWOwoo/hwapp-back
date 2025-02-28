import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('hot_deals')
export class HotDeal {
    @Column()
    id : number;

    @Column()
    site : string;

    @Column()
    title : string;
    
    @PrimaryColumn()
    link : string;

    @Column()
    price : string;

    @Column()
    createAt: string;
}