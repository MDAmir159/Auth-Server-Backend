import express from 'express';
import bodyParser from 'body-parser';
import connectToMongoDB from './config/dbConfig';
import routes from "./routes";

const app = express();

app.use(bodyParser.json());

app.use(routes);

connectToMongoDB();

export default app;
