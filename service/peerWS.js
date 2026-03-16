const { WebSocketServer } = require('ws');

module.exports = { peerProxy };

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ server: httpServer  });

    wss.on('connection', (ws) => {
        ws.isAlive = true;

        ws.on('message', (data) => {
            const msg = JSON.parse(data);
            console.log('received: %s', msg);

            wss.clients.forEach(function each(client) {
                    if (client.readyState === 1) { 
                        client.send(JSON.stringify(msg));
                    }
            });
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