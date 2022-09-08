import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MailVertification {
  @PrimaryColumn()
  id: string;
  
  /**
   * 用户编码
   */
  @Column()
  user_code: string;

  /**
   * 郵箱
   */
  @Column()
  to_mail: string;

  /**
   * 过期时间
   */
  @Column()
  expired_time?: Date;

  /**
   * 邮件内容
   */
  @Column()
  content: string;

  /**
   * 是否成功
   */
  @Column({ default: false })
  is_success: boolean;
}