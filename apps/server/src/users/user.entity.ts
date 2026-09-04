import { Column, Entity, PrimaryColumn } from 'typeorm';

export type UserRole = 'admin' | 'teacher' | 'student';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: 'teacher' })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;
}
