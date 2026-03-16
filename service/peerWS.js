const { WebSocketServer } = require('ws');

module.exports = { peerProxy };

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ server: httpServer  });

    wss.on('connection', (ws) => {
        ws.isAlive = true;

        ws.on('message', (data) => {
            const msg = String.fromCharCode(...data);
            console.log('received: %s', msg);

            ws.send(`I heard you say "${msg}"`);
        });

        ws.on('pong', () => {
            ws.isAlive = true;
        });
    });

    setInterval(() => {
        wss.clients.forEach(function each(client) {
            if (client.isAlive === false) return client.terminate();

            client.isAlive = false;
            client.ping();
        });
    }, 10000);
}