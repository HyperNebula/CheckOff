const { WebSocketServer } = require('ws');

module.exports = { peerProxy };

const updateArray = []

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ server: httpServer  });

    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.send(JSON.stringify(updateArray));

        ws.on('message', (data) => {
            const msg = JSON.parse(data);

            updateArray.unshift(msg);
            
            if (updateArray.length > 10) {
                updateArray.pop()
            }

            wss.clients.forEach(function each(client) {
                    if (client.readyState === 1) { 
                        client.send(JSON.stringify(updateArray));
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