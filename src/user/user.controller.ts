import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmailService } from 'src/email/email.service';
import { AuthUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('data')
  @UseGuards(AuthGuard('jwt'))
  getData(@AuthUser('code') code: string) {
    return this.userService.getData(code);
  }
  
  @Put('data')
  @UseGuards(AuthGuard('jwt'))
  update(@Body() userDto: User) {
    this.userService.updateData(userDto);
  }

  @Post('data')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createUserDto: User) {
    this.userService.createData(createUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.userService.deleteData(id);
  }

  @Get('verify/:id')
  async verify(@Param('id') id: string) {
    var result = await this.userService.verifyMail(id);
    if (result) {
      return '邮箱验证成功';
    }
    return '邮箱验证失败';
  }
}
