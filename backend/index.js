import express, { json } from 'express';

import { setupDB } from './Config/DB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CatchError } from './Services/CatchError.js';
import authRouter from './Routes/auth.routes.js';
import shopRouter from './Routes/shop.routes.js';
import userRouter from './Routes/customer.routes.js';
import deliveryRouter from './Routes/delivery.routes.js';
import { ENV } from './Services/env.js';
import { app, httpServer } from './Config/socket.js';

const port = ENV.PORT || 5000;

app.use(
  cors({
    origin: ENV.CLIENT,
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/shop', shopRouter);
app.use('/api/user', userRouter);
app.use('/api/delivery', deliveryRouter);
app.use(CatchError);

setupDB();

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
