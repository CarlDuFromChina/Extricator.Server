import { NotificationMethod } from "src/user/user.entity";

export class RegisterDto {
  code: string;
  password: string;
  cookie: any;
  notification_method: NotificationMethod
}