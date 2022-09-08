import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import EncryptFactory, { IEncrypt, EncryptType } from '../common/encrypt';
import assert from 'src/common/assert';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  private md5: IEncrypt;
  
  constructor(
    @InjectRepository(User)
    private usersReporsitory: Repository<User>,
    private emailService: EmailService
  ) {
    this.md5 = EncryptFactory.createInstance(EncryptType.md5);
  }

  async getData(code: string, withPwd: boolean = false): Promise<User> {
    var data = await this.usersReporsitory.findOne(code);
    if (data && !withPwd) {
      data.password = null;
    }
    return data;
  }

  async getAllData(): Promise<User[]> {
    return this.usersReporsitory.find();
  }

  async createData(user: User): Promise<void> {
    if (assert.isEmpty(user.code) || assert.isEmpty(user.password)) {
      throw new HttpException('注册失败', 500);
    }
    var data = await this.getData(user.code);
    if (!assert.isNil(data)) {
      throw new HttpException('注册失败，用户已被注册', 500);
    }

    user.password = this.md5.encrypt(user.password);
    await this.usersReporsitory.save(user);
  }

  async updateData(user: User, withPwd: boolean = false): Promise<void> {
    if (assert.isEmpty(user.code) || (assert.isEmpty(user.password) && withPwd)) {
      throw new HttpException('更新失败，用户编号和密码不能为空', 500);
    }
    var data = await this.getData(user.code, true);
    if (!data) {
      throw new HttpException('更新失败，用户不存在', 500);
    }

    // 邮箱变更需要重新验证邮箱
    if (data.email !== user.email) {
      user.mail_verified = false;
    }

    // 更新密码
    if (withPwd) {
      user.password = this.md5.encrypt(user.password);
    } else {
      user.password = data.password;
    }
    
    await this.usersReporsitory.save(user);
  }

  async deleteData(code: string): Promise<boolean> {
    if (assert.isEmpty(code)) {
      return false;
    }
    var data = await this.getData(code);
    if (assert.isNil(data)) {
      throw new HttpException('删除失败，用户不存在', 500);
    }
    var result = await this.usersReporsitory.delete(code);
    return result.affected > 0;
  }

  async verifyMail(id: string) {
    var data = await this.emailService.verifyMail(id);
    if (data && data.is_success) {
      var user = await this.getData(data.user_code, false);
      user.mail_verified = true;
      await this.updateData(user, false);
      return true;
    }
    return false;
  }
}
