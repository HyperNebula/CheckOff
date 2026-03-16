import { useEffect, useRef } from 'react';

export function WebsocketComponent() {
    const socketRef = useRef(null);

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
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send("Hello, message sent!");
        }
    };
}