import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JdModule } from './jd/jd.module';
import { JuejinModule } from './juejin/juejin.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CheckinRecordModule } from './checkin-record/checkin-record.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';

var dbConfig = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || '5432',
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || '123123',
  database: process.env.TYPEORM_DATABASE || 'extricator'
} as TypeOrmModuleOptions;

@Module({
  imports: [
    JdModule,
    JuejinModule,
    AuthModule,
    UserModule,
    ScheduleModule.forRoot(),
    TaskModule,
    TypeOrmModule.forRoot({
      ...dbConfig,
      autoLoadEntities: true,
      synchronize: true
    }),
    CheckinRecordModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
