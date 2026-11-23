import express from 'express'; // Creates web server and manages routes
import cors from 'cors'; // security middleware so Next can talk to backend
import dotenv from 'dotenv'; // Reads from .env file and loads into Node
import { pool, testDBConnection } from './db';
import { WaitTimeCalculator } from './calculator';


dotenv.config(); //Loads env file into local variables, runs first because we need env access/secrets

const app = express(); // Creates Express app
const PORT = process.env.PORT || 8000; // Check if host in env or default to 8000

app.use(cors()); // adding Cors middleware
app.use(express.json()); // Incoming http request with json get turned into a JS obj

// Listens for get requests on '/api/health' path
app.get('/api/health', (req, res) => { // Res: response obj to sned data back to user (json), Req: contains info about incoming request 
    res.json({ status: 'ok', message: "Jan's line Node api is RUNNNINGGG!"});
});

app.get('/api/venues', async (req, res) => {
    try {
        const countCheck = await pool.query('SELECT COUNT(*) FROM venues');
        if (parseInt(countCheck.rows[0].count) === 0) {
            await pool.query(
                'INSERT INTO venues (name, default_wait_mins, vibe) VALUES ($1, $2, $3)',
                ["Jack & Dan's", 25, "the line is past the corner"]
            );
        }

        const result = await pool.query('SELECT * FROM venues');
        
        const venues = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            waitMins: row.default_wait_mins,
            vibe: row.vibe,
        }));

        res.json(venues);
    } catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post('/api/checkins', async (req, res) => {
    try {
        const { venueId, waitMins } = req.body;

        await pool.query(
            'INSERT INTO check_in_reports (venue_id, wait_mins) VALUES ($1, $2)',
            [venueId, waitMins]
        );

        const reportsResult = await pool.query(
            `SELECT wait_mins, created_at FROM check_in_reports
            WHERE venue_id = $1 
                AND created_AT >= NOW() - INTERVAL '90 minutes'
            ORDER BY created_at DESC`,
            [venueId]
        );

        const reports = reportsResult.rows.map((row) => ({
            waitMins: row.wait_mins,
            createdAt: new Date(row.created_at),
        }));

        const calc = new WaitTimeCalculator();
        const newWait = calc.calculateWait(reports, 10);

        res.json({ id: venueId, waitMins: newWait});
    } catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to record check-in'});
    }
});



app.listen(PORT, () => { // Attach this program to a specified port
    console.log(`Server listening on http://local:${PORT}`);
    testDBConnection();
});
