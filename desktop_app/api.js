const axios = require("axios");
const WebSocket = require("ws");

let ws = null;

const API_BASE_URL = "https://api.accstool.com";
const WS_URL = "wss://accstool.com";

// Function to fetch active products
const getActiveProducts = async (customerEmail, password, macAddress) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/order/getActiveOrderByCustomerEmail`,
            {
                customerEmail,
                password,
                mac: macAddress
            }
        );
        return response.data.activeProducts;
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return [];
    }
};

// Function to handle WebSocket connection
const subscribeToWebSocket = (email, macAddress, onMessageCallback) => {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket(WS_URL);

    ws.on("open", () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ type: "subscribe", email }));
    });

    ws.on("message", (data) => {
        const messageString = data.toString();
        const message = JSON.parse(messageString);
        console.log("Parsed WebSocket message:", message);

        if (onMessageCallback) {
            onMessageCallback(message, email, macAddress);
        }
    });

    ws.on("close", () => {
        console.log("WebSocket disconnected");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });

    return ws;
};

// Function to request new password
const requestNewPassword = async (email) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/customer/newPassword`,
            { email }
        );
        return response.data;
    } catch (error) {
        console.error("Error requesting new password:", error);
        throw error;
    }
};

module.exports = {
    getActiveProducts,
    subscribeToWebSocket,
    requestNewPassword
};
