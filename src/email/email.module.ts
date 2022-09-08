import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailVertification } from './mail-vertification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MailVertification])],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController]
})
export class EmailModule {}
