import { DATABASE_URL } from 'src/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/modules/database/infrastructure/drizzle',
  schema: './src/modules/database/infrastructure/drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL!
  },
});
