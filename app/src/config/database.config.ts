import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

type DatabaseConfig = TypeOrmModuleOptions;

const databaseConfigFactory: ConfigFactory<DatabaseConfig> = () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'db',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '../**/*.entity{.ts,.js}'],
});

const databaseConfig = registerAs('database', databaseConfigFactory);

export { databaseConfig };
export type { DatabaseConfig };
