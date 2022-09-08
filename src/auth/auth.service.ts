import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import assert from 'src/common/assert';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import EncryptFactory, { EncryptType, IEncrypt } from '../common/encrypt';
@Injectable()
export class AuthService {
  private md5: IEncrypt;

  constructor(private userService: UserService, private jwtService: JwtService) {
    this.md5 = EncryptFactory.createInstance(EncryptType.md5);
  }

  signup(user: User): Promise<void> {
    return this.userService.createData(user);
  }

  /**
   * 验证登陆
   * @param code 用户编码
   * @param password 当前密码
   * @returns User
   */
  async validate(code: string, password: string): Promise<User> {
    const data = await this.userService.getData(code, true);
    if (data == null) {
      return null;
    }

    if (this.md5.encrypt(password) === data?.password) {
      return data;
    }
    
    return null;
  }

  /**
   * 更新密码
   * @param code 用户编码
   * @param oldPass 当前密码
   * @param newPass 新密码
   */
  async updatePassword(code: string, oldPass: string, newPass: string) {
    var user = await this.userService.getData(code);
    if (user == null) {
      return null;  
    }

    assert.isSame(user.password, this.md5.encrypt(oldPass), '密码错误');

    user.password = newPass;
    this.userService.updateData(user, true);
  }

  /**
   * 登陆
   * @param user 用户实体
   * @returns 
   */
  async login(user: User): Promise<string> {
    return this.jwtService.sign({ code: user.code });
  }
}
