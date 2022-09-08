import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


export enum MailVerifyType {
  Link,
  Mask
}

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
   * 验证码
   */
  @Column({ nullable: true })
  verification_code: string;


  /**
   * 验证类型
   */
  @Column({
    type: "enum",
    enum: MailVerifyType,
    default: MailVerifyType.Link
  })
  verification_type: MailVerifyType

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