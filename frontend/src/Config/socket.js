import { io } from 'socket.io-client';

let socket = null;

export const initSocketConnection = (userID, role) => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: {
        userID,
        role,
      },
      withCredentials: true,
    });
  }

  return socket;
};

export const getSocket = () => socket;
