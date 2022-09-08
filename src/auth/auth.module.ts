import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth.local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './jwt.contants';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ secret: jwtContants.secret })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
