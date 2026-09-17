import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './schema.d';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema.json'), 'utf8'));

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL'] || 'postgresql://localhost:5432/mydb',
});
