import { ArrayMinSize, IsArray, IsDateString, IsString, MinLength } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsDateString()
  deadline: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  questionIds: string[];
}
