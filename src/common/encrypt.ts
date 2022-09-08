/**
 * 加密/解密接口
 */
export interface IEncrypt {
  encrypt(input: string, key?: string): string,
  decrypt(input: string, key?: string): string
}

/**
 * MD5加密
 */
export class MD5Encrypt implements IEncrypt {
  encrypt(input: string, key?: string): string {
    var md5 = require('md5');
    return md5(input);
  }
  decrypt(input: string, key?: string): string {
    throw new Error("Method not implemented.");
  }
}

export enum EncryptType {
  md5,
  rsa,
  aes
}

/**
 * 加密工厂类
 */
export default class EncryptFactory {
  static createInstance(type: EncryptType) {
    switch (type) {
      case EncryptType.md5:
        return new MD5Encrypt();
      case EncryptType.rsa:
      case EncryptType.aes:
      default:
        throw new Error('unsurport encrypt type');
    }
  }
}