
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobileNumber: string;

  @Column()
  language: string;

  @Column()
  Botid: string;

  @Column({ nullable: true })
  selectedCategory: string;

  @Column({ nullable: true })
  setName: string;

  @Column({ default: 0 })
  currentQuestionIndex: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  currCrouslePage: number;

  @Column({ default: 0 })
  maxCrouselPage: number;

  // ✅ Add this new property
  @Column({ default: false })
  hasSeenMore: boolean;
}
