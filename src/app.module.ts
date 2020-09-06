import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    TasksModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
  ],
})

export class AppModule {
}
