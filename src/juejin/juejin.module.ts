/* juejin.module.ts */

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinRecordModule } from 'src/checkin-record/checkin-record.module';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { JuejinController } from './juejin.controller';
import { Juejin } from './juejin.entity';
import { JuejinService } from './juejin.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      baseURL: 'https://api.juejin.cn/',
      maxRedirects: 5,
      withCredentials: true,
    }),
    TypeOrmModule.forFeature([Juejin]),
    CheckinRecordModule,
  ],
  controllers: [JuejinController],
  providers: [JuejinService],
  exports: [JuejinService],
})
export class JuejinModule {}
