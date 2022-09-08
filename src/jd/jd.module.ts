import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinRecordModule } from 'src/checkin-record/checkin-record.module';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { JdController } from './jd.controller';
import { Jd } from './jd.entity';
import { JdService } from './jd.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      baseURL: 'https://api.m.jd.com',
      maxRedirects: 5,
      withCredentials: true,
    }),
    CheckinRecordModule,
    TypeOrmModule.forFeature([Jd]),
  ],
  controllers: [JdController],
  providers: [JdService],
  exports: [JdService],
})
export class JdModule {}
