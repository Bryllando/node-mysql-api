import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ 
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.CORS_ORIGIN];
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    credentials: true 
}));

app.use('/accounts', accountsController);

app.use('/api-docs', swaggerDocs);

// redirect / to /api-docs
app.get('/', (req, res) => res.redirect('/api-docs'));

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server listening on port ' + port));