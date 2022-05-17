import { ConfigFactory } from '@nestjs/config/dist/interfaces/config-factory.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import * as path from 'path';

type DatabaseConfig = TypeOrmModuleOptions;

const databaseConfigFactory: ConfigFactory<DatabaseConfig> = () => {
  const baseUrl = path.resolve(__dirname, '..');
  const migrationsDir: string = baseUrl + '/migrations';

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'db',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [baseUrl + '/**/*.entity{.ts,.js}'],
    migrations: [migrationsDir + '/*.{ts,js}'],
    cli: {
      migrationsDir,
    },
  };
};

const databaseConfig = registerAs('database', databaseConfigFactory);

export { databaseConfig, databaseConfigFactory };
export type { DatabaseConfig };
