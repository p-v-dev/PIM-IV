import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  teacherId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('datetime2')
  deadline: Date;

  @Column('simple-json')
  questionIds: string[];

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;
}
