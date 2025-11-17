// Neon Database Connection
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Neon connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Helper function to check connection
export async function checkConnection() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
