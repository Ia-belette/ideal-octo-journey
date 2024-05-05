import { drizzle } from '@xata.io/drizzle';

// Generated with CLI
import { getXataClient } from '../xata';

const xata = getXataClient();

export const db = drizzle(xata);
