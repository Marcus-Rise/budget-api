import { databaseConfigFactory } from './config/database.config';
import * as path from 'path';
import * as fs from 'fs';

fs.writeFileSync(
  path.resolve(__dirname + '/../ormconfig.json'),
  JSON.stringify(databaseConfigFactory(), null, 2), // last parameter can be changed based on how you want the file indented
);
