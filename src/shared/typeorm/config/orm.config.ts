import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'food_db',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export default ormConfig;
