import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/user/user.decorator';
import { User } from 'src/user/user.entity';
import { Transaction } from 'typeorm';
import { AuthService } from './auth.service';
import { ChangePwdDto } from './dto/change-pwd.dto';
import { RegisterDto } from './dto/regsiter.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() request) {
    return this.authService.login(request.user);
  }

  @Post('signup')
  signup(@Body() regsiterDto: RegisterDto) {
    var user = regsiterDto as User;
    return this.authService.signup(user);
  }

  @Post('changePassword')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@AuthUser('code') code: string, @Body() changePwdDto: ChangePwdDto) {
    return this.authService.updatePassword(code, changePwdDto.oldpass, changePwdDto.pass);
  }
}
