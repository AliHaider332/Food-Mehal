import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { initSocketConnection } from '../Config/socket';

const useEstablishSocketConnection = () => {
  const { user } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = initSocketConnection(user._id, user.role);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      newSocket?.disconnect();
    };
  }, [user?._id]);

  return socket;
};

export default useEstablishSocketConnection;
