import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import { ENV } from '../Services/env.js';
export const app = express();

export const httpServer = http.createServer(app);
dotenv.config();
export const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT,
    credentials: true,
  },
});

const LiveTraffic = {};

io.on('connection', (socket) => {
  const { userID } = socket.handshake.auth;

  if (!userID) return;

  LiveTraffic[userID] = socket.id;
  socket.on("live-location",(data)=>{
    const {user,orderId,location}=data
   
    if(LiveTraffic[user]){
      io.to(LiveTraffic[user]).emit('receive-live-location', {
        location,
        orderId
      });
    }
  })
  
  console.log('Connected:', userID);
  console.log(Object.keys(LiveTraffic).length);
 

  socket.on('disconnect', () => {
    delete LiveTraffic[userID];
  });
});


export const getSocketId = (receiverID) => {
  return LiveTraffic[receiverID];
};
export const getArraySocketId = (receiverIDs) => {
  return receiverIDs.map((id) => LiveTraffic[id]).filter(Boolean); // removes undefined/null
};
