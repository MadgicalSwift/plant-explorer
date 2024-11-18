import { IsString, IsNumber } from 'class-validator';

export class User {
  @IsString()
  mobileNumber: string;

  @IsString()
  language: string;

  @IsString()
  Botid: string;

  @IsString()
  selectedCategory: string | null;

  @IsString()
  setName: string | null;

  @IsNumber()
  currentQuestionIndex: number = 0;

  @IsNumber()
  score: number = 0;
}
