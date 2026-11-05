import { ArrayMinSize, ArrayUnique, IsArray, IsDateString, IsString, IsUUID, MinLength } from 'class-validator';

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
  @ArrayUnique()
  @IsUUID('all', { each: true })
  questionIds: string[];
}
