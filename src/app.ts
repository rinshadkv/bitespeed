import express from 'express';
import bodyParser from 'body-parser';
import contactRoutes from './routes/contactRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/api', contactRoutes);

export default app;
