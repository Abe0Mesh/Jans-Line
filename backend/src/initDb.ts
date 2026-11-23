import fs from 'fs'; // gives node permission to read and write files
import path from 'path'; // helps build file paths 
import { pool } from './db';

async function init() {
    try{
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        await pool.query(sql);
        console.log('Successfully made tables in DB');
    } catch(e) {
        console.error('Error creating tables:', e);
    } finally {
        await pool.end();
    }

}

init();
