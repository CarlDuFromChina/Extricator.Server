import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { JdModule } from 'src/jd/jd.module';
import { JuejinModule } from 'src/juejin/juejin.module';
import { UserModule } from 'src/user/user.module';
import { TaskService } from './task.service';

@Module({
  imports: [JdModule, JuejinModule, UserModule, EmailModule],
  providers: [TaskService],
})
export class TaskModule {}