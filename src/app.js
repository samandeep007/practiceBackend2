import cookieParser from 'cookie-parser';
import express, { urlencoded } from'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { router as userRouter } from './routes/user.routes.js';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP. Try again later!",
    header: true
})

app.use(express.static('./public'));

app.use(urlencoded({
    limit: "16kb",
    extended: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true
}))

app.use(cookieParser());

app.use(limiter);

app.use('/api/auth', userRouter);

export {app};