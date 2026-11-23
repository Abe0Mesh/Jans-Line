import { Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();


export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // encrypt traffic between local and aws rds
    }
});

export async function testDBConnection(){
    try {
        const client = await pool.connect();
        console.log('Sucessfully connected to DB');
        client.release(); // releases back to pool
    } catch(e) {
        console.error('DB connection failed: ', e);
    }
}


