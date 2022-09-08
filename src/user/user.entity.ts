import { Column, Entity, PrimaryColumn } from "typeorm";

export enum NotificationMethod {
  /**
   * 企业微信
   */
  WeCom,
  /**
   * 邮件
   */
  Email,
}
@Entity()
export class User {
  @PrimaryColumn()
  code: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: false })
  mail_verified?: boolean;

  @Column({ nullable: true })
  phone?: string;
  
  @Column({
    type: "enum",
    enum: NotificationMethod,
    default: NotificationMethod.Email
  })
  notification_method: NotificationMethod
}