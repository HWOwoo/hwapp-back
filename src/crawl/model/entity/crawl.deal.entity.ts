import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('hot_deals')
export class HotDeal {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    site : string;

    @Column()
    title : string;

    @Column()
    link : string;

    @Column()
    price : string;

    @Column()
    createAt: string;
}