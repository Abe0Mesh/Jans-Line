import express from 'express'; // Creates web server and manages routes
import cors from 'cors'; // security middleware so Next can talk to backend
import dotenv from 'dotenv'; // Reads from .env file and loads into Node

dotenv.config(); //Loads env file into local variables, runs first because we need env access/secrets

const app = express(); // Creates Express app
const PORT = process.env.PORT || 8000; // Check if host in env or default to 8000

app.use(cors()); // adding Cors middleware
app.use(express.json()); // Incoming http request with json get turned into a JS obj

// Listens for get requests on '/api/health' path
app.get('/api/health', (req, res) => { // Res: response obj to sned data back to user (json), Req: contains info about incoming request 
    res.json({ status: 'ok', message: "Jan's line Node api is RUNNNINGGG!"});
});

app.listen(PORT, () => { // Attach this program to a specified port
    console.log(`Server listening on http://local:${PORT}`);
});
