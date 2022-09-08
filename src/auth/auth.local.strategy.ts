import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'code'
    });
    this.authService = authService;
  }

  async validate(code: string, password: string): Promise<User> {
    const user = await this.authService.validate(code, password);
    if (user) return user;
    else throw new UnauthorizedException('incorrect code or password');
  }
}