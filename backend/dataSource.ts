import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import Users from './src/entities/Users';

ConfigModule.forRoot();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users],
  synchronize: false,
  logging: true,
});

export default dataSource;
