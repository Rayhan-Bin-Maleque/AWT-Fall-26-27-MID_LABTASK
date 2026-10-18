import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CourseModule } from './course/course.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { EnrollmentModule } from './enrollment/enrollment.module.js';

@Module({
  imports: [CourseModule, NotificationModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
