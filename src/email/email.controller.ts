import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { EmailService } from './email.service';
import { MailVerifyType } from './mail-vertification.entity';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  sendVerifyMail(@AuthUser('code') code: string, @Body() dto: any) {
    return this.emailService.sendVerifyMail(dto.email, code);
  }

  @Post('mask')
  sendMask(@Body() dto: any) {
    return this.emailService.sendVerifyMail(dto.email, null, MailVerifyType.Mask);
  }
}
