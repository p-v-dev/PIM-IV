import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  prompt: string;

  @Column('simple-json')
  options: string[];

  @Column()
  correctOptionIndex: number;
}
