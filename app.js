//DOTENC
import dotenv from 'dotenv';
dotenv.config();

import 'express-async-errors';
// require('dotenv').config();

//EXPRESS
import express from 'express';
const app = express();

import notFound from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import connectDB from './db/connect.js';
import productsRouter from './routes/products.js';

// middleware
app.use(express.json());

// routes
app.use('/api/v1/products', productsRouter);

// products route
app.use(notFound);
app.use(errorHandlerMiddleware);


const port = 80;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Listening on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
}
start();

