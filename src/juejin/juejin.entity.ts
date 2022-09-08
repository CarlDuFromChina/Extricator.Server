import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Juejin {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  user_code: string;

  /**
   * cookie 字符串
   */
  @Column()
  cookie: string;

  /**
   * 过期时间
   */
  @Column({ nullable: true })
  expired_at?: Date;

  /**
   * 自动签到
   */
  @Column({ default: true })
  auto_sign: boolean;

  /**
   * 签到成功提醒
   */
  @Column({ default: true })
  enable_success_notify: boolean;

  /**
   * 签到失败提醒
   */
  @Column({ default: true })
  enable_error_notify: boolean;

  /**
   * cookie 过期提醒
   */
   @Column({ default: true })
  enable_cookie_expired_notify: boolean;

  /**
   * 上次过期提醒时间
   */
  @Column({ nullable: true })
  last_expiration_reminder_time?: Date;

  /**
   * 更新时间
   */
  @Column({ default: new Date() })
  updated_at: Date;

  /**
   * 创建时间
   */
  @Column({ default: new Date() })
  created_at: Date
}