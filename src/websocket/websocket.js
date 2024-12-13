const { WebSocketServer } = require("ws");

const clients = new Map(); // Store clients subscribed by email

const setupWebSocket = (server) => {
    const wss = new WebSocketServer({ noServer: true });

    wss.on("connection", (ws, req) => {
        console.log("New WebSocket connection");

        // Handle messages from clients
        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === "subscribe" && data.email) {
                    // Add client to the subscription map
                    clients.set(data.email, ws);
                    console.log(`Client subscribed with email: ${data.email}`);
                }
            } catch (error) {
                console.error("Invalid WebSocket message:", error);
            }
        });

        // Remove client on disconnect
        ws.on("close", () => {
            for (const [email, socket] of clients) {
                if (socket === ws) {
                    clients.delete(email);
                    console.log(`Client unsubscribed: ${email}`);
                    break;
                }
            }
        });
    });

    // Upgrade HTTP connections to WebSocket connections
    server.on("upgrade", (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    });

    return wss;
};

// Function to broadcast data to a specific email
const broadcastToClient = (email, data) => {
    console.log(`Broadcasting to email: ${email}`);

    const clientSocket = clients.get(email);

    if (!clientSocket) {
        console.error(`No WebSocket client found for email: ${email}`);
        return;
    }

    if (clientSocket.readyState !== clientSocket.OPEN) {
        console.error(`WebSocket for email ${email} is not open. State: ${clientSocket.readyState}`);
        return;
    }

    try {
        clientSocket.send(JSON.stringify(data));
        console.log(`Data published to WebSocket for email: ${email}`);
    } catch (error) {
        console.error(`Failed to send data to WebSocket for email ${email}:`, error);
    }
};

module.exports = { setupWebSocket, broadcastToClient };
