import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormconfig: TypeOrmModuleOptions = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME_DEVELOPMENT || 'task-management',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 54322,
  type: 'postgres',
  autoLoadEntities: true,
  synchronize: true,
};
