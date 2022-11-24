import { ConfigModule } from '@nestjs/config';
import User from 'src/entities/User.entity';
import { DataSource } from 'typeorm';

ConfigModule.forRoot();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: false,
  logging: true,
});

export default dataSource;
