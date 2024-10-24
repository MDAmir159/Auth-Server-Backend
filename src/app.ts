import express from 'express';
import bodyParser from 'body-parser';
import connectToMongoDB from './config/dbConfig';
import routes from "./routes";
import cors from 'cors';  // Import the CORS middleware

const app = express();

// Add CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(bodyParser.json());

app.use(routes);

connectToMongoDB();

export default app;
