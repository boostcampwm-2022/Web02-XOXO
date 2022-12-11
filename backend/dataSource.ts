import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

ConfigModule.forRoot();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/src/entities/*.entity{.ts,.js}`],
  synchronize: true,
  logging: true,
});

export default dataSource;
