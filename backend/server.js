import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from './config/db.js';
import registrationRoutes from './routes/registrationRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5001;

export const asyncLocalStorage = new AsyncLocalStorage();

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add request ID middleware
app.use((req, res, next) => {
    asyncLocalStorage.run(new Map(), () => {
        const requestId = uuidv4();
        asyncLocalStorage.getStore().set('requestId', requestId);
        next();
    });
});

// Debug middleware to log requests
app.use((req, res, next) => {
    const requestId = asyncLocalStorage.getStore().get('requestId');
    console.log(`[${requestId}] ${req.method} ${req.url}`);
    console.log(`[${requestId}] Request Body:`, req.body);
    next();
});

app.use('/api/registrations', registrationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
