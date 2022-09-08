import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CheckinRecord {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  user_code: string;
  
  @Column()
  status: boolean;

  @Column({ nullable: true })
  error_reason: string;
  
  @Column()
  platform: string;

  @Column()
  platform_name: string;

  @Column()
  created_at: Date;
}