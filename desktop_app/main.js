const { app, BrowserWindow, ipcMain, session } = require("electron");
const axios = require("axios");
const path = require("path");
const os = require("os");
const WebSocket = require("ws");
const { getActiveProducts, subscribeToWebSocket, requestNewPassword } = require("./api");

let mainWindow;
let macAddress = null;
let ws = null;

// Function to get the system's MAC address
const getMacAddress = () => {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];

        for (const iface of interfaces) {
            // Skip internal or invalid interfaces
            if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
                console.log(`Found MAC address: ${iface.mac}`);
                return iface.mac; // Return the first valid MAC address
            }
        }
    }

    console.error("No valid MAC address found. Returning default MAC address.");
    return "00:00:00:00:00:00"; // Default value if no MAC address is found
};

// Function to set dynamic cookies
const setDynamicCookies = async (cookies, url) => {
    const cookiePromises = cookies.map((cookie) => {
        const cookieDetails = { url };
        Object.keys(cookie).forEach((key) => {
            cookieDetails[key] = cookie[key];
        });

        if (!cookieDetails.domain) {
            cookieDetails.domain = new URL(url).hostname;
        }

        return session.defaultSession.cookies.set(cookieDetails);
    });

    try {
        await Promise.all(cookiePromises);
        console.log("All cookies set successfully!");
    } catch (error) {
        console.error("Error setting cookies:", error);
    }
};

// Function to handle WebSocket message
const handleWebSocketMessage = (message, email, macAddress) => {
    if (message.customerEmail === email && message.mac === macAddress) {
        console.log("Valid WebSocket data received:", message);
    } else {
        console.error("Invalid WebSocket data received. Refreshing interface.");
        mainWindow.reload();
        app.quit();
    }
};

app.whenReady().then(() => {
    macAddress = getMacAddress();

    if (!macAddress || macAddress === "00:00:00:00:00:00") {
        console.error("Invalid MAC address detected. Please check your network configuration.");
    } else {
        console.log("Valid MAC address:", macAddress);
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile("index.html");

    ipcMain.handle("get-active-products", async (event, customerEmail, password) => {
        // Subscribe to WebSocket with the message handler
        subscribeToWebSocket(customerEmail, macAddress, handleWebSocketMessage);

        // Fetch data from the backend API
        return await getActiveProducts(customerEmail, password, macAddress);
    });

    ipcMain.handle("request-new-password", async (event, email) => {
        try {
            return await requestNewPassword(email);
        } catch (error) {
            console.error("Error requesting new password:", error);
            throw error;
        }
    });

    ipcMain.handle("open-url-with-cookies", async (event, { url, cookies }) => {
        const newWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
            },
        });

        await setDynamicCookies(cookies, url);
        newWindow.loadURL(url);
    });

    ipcMain.handle("get-mac-address", () => macAddress); // Expose MAC address to renderer
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
