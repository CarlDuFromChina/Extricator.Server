import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { EmailService } from './email.service';

@Controller('email')
@UseGuards(AuthGuard('jwt'))
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('verify')
  sendVerifyMail(@AuthUser('code') code: string, @Body() dto: any) {
    return this.emailService.sendVerifyMail(dto.email, code);
  }
}
