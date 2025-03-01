import express, { Router } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import MongoDb from './db/mongodb';
import noteRouter from './routes/note'
import { PORT, NODE_ENV } from './constants';


(async () => {
    const db = new MongoDb()
    await db.connect()
    const app = express();

    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use((req, res, next) => {
        res.locals.db = db;
        next()
    })

    app.use('/api/note', noteRouter)

    app.listen(PORT, () => {
        /* eslint-disable no-console */
        console.log(NODE_ENV, 'mode')
        console.log(`Listening on port ${PORT}`);
        /* eslint-enable no-console */
    });
})()

