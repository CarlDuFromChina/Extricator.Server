import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtContants } from "./jwt.contants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 获取请求header token值
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      secretOrKey: jwtContants.secret,
    })
  }

  async validate(payload: any): Promise<any> {
    return { code: payload.code };
  }
}