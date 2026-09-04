import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('attempts')
export class Attempt {
  @PrimaryColumn('uuid') id: string;
  @Column('uuid') studentId: string;
  @Column('uuid') examId: string;
  @Column('simple-json') answers: { questionId: string; selectedOptionIndex: number }[];
  @Column() score: number;
  @Column() totalQuestions: number;
  @CreateDateColumn({ type: 'datetime2' }) createdAt: Date;
}
