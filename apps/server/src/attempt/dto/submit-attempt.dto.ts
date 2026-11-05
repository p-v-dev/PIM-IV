import { ArrayMinSize, IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class AnswerDto { @IsUUID('all') questionId: string; @IsInt() @Min(0) selectedOptionIndex: number; }
export class SubmitAttemptDto { @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => AnswerDto) answers: AnswerDto[]; }
