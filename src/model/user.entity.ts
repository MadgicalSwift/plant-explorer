import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  mobileNumber: string;

  @Column()
  language: string;

  @Column()
  botID: string;
 
  @Column({ nullable: true })
  selectedCategory: string;

  @Column({ nullable: true })
  setName: string;

  @Column({ default: 0 })
  currentQuestionIndex : number;

  @Column({ default: 0 })
  score : number;
}
