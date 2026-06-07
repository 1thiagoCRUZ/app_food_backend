import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'food_db',
  entities: [join(__dirname, '../../../**/*.schema{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
