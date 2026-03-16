import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export function WebsocketComponent({ children }) {
    const socketRef = useRef(null);
    
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        const port = 4000; //window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        
        socketRef.current = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        const socket = socketRef.current;

        socket.onopen = () => {
            console.log('WebSocket connection established.');
            socket.send('I am listening');
        };

        socket.onmessage = (event) => {
            console.log('received: ', event.data);
            
            setUpdates((prevMessages) => [...prevMessages, event.data]);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendUpdate = (update) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(update);
        } else {
            console.warn("WebSocket is not connected!");
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendUpdate, updates }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};