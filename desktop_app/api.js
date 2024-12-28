const axios = require("axios");
const WebSocket = require("ws");

let ws = null;
let retryCount = 0;
const MAX_RETRIES = 2;

const API_BASE_URL = "https://api.accstool.com";
const WS_URL = "wss://api.accstool.com";

// Function to fetch active products
const getActiveProducts = async (customerEmail, password, macAddress) => {
    try {
        console.log(`Email: ${customerEmail}, Password: ${password}, MAC Address: ${macAddress}`);
        const response = await axios.post(
            `${API_BASE_URL}/order/getActiveOrderByCustomerEmail`,
            {
                customerEmail,
                password,
                mac: macAddress
            }
        );

        if (response.data && response.data.activeProducts) {
            console.log('Active products received:', response.data.activeProducts);
            return response.data.activeProducts;
        } else {
            console.log('No active products in response:', response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching data from API:", error.response?.data || error.message);
        throw error;
    }
};

// Function to handle WebSocket connection
const subscribeToWebSocket = (email, macAddress, onMessageCallback) => {
    // If we've exceeded retry attempts, don't try to reconnect
    if (retryCount >= MAX_RETRIES) {
        console.log('Maximum WebSocket retry attempts reached. WebSocket functionality will be disabled.');
        return;
    }

    if (ws) {
        try {
            ws.close();
        } catch (e) {
            console.log('Error closing existing WebSocket:', e);
        }
    }

    try {
        console.log('Attempting to connect to WebSocket at:', WS_URL);
        ws = new WebSocket(WS_URL, {
            headers: {
                'User-Agent': 'AccsTool Desktop Client',
                'Origin': 'electron://accstool'
            },
            handshakeTimeout: 5000
        });

        ws.on("open", () => {
            console.log("WebSocket connected successfully");
            retryCount = 0;
            try {
                const subscribeMessage = {
                    type: "subscribe",
                    email,
                    mac: macAddress,
                    client: 'desktop'
                };
                console.log('Sending subscription message:', subscribeMessage);
                ws.send(JSON.stringify(subscribeMessage));
            } catch (e) {
                console.error('Error sending subscription message:', e);
            }
        });

        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log("Received WebSocket message:", message);
                if (onMessageCallback) {
                    onMessageCallback(message, email, macAddress);
                }
            } catch (e) {
                console.error('Error processing WebSocket message:', e);
            }
        });

        ws.on("error", (error) => {
            console.error("WebSocket error:", error.message);
            retryCount++;
            if (retryCount >= MAX_RETRIES) {
                console.log(`WebSocket failed after ${MAX_RETRIES} attempts. Disabling WebSocket functionality.`);
            }
        });

        ws.on("close", () => {
            console.log("WebSocket disconnected");
            if (retryCount < MAX_RETRIES) {
                console.log(`WebSocket retry attempt ${retryCount + 1}/${MAX_RETRIES}`);
                setTimeout(() => {
                    if (email && macAddress) {
                        subscribeToWebSocket(email, macAddress, onMessageCallback);
                    }
                }, 5000);
            }
        });
    } catch (error) {
        console.error("Error setting up WebSocket:", error);
        retryCount++;
    }
};

// Function to request new password
const requestNewPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/customer/newPassword`, {
            email
        });
        console.log("New password response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error requesting new password:", error);
        throw error;
    }
};

module.exports = {
    getActiveProducts,
    subscribeToWebSocket,
    requestNewPassword,
    axios,
    WebSocket,
    API_BASE_URL,
    WS_URL,
    MAX_RETRIES
};
