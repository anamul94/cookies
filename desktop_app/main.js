const { app, BrowserWindow, ipcMain, session } = require("electron");
const axios = require("axios");
const path = require("path");
const os = require("os");
const fs = require('fs');
const WebSocket = require("ws");
const { getActiveProducts, subscribeToWebSocket, requestNewPassword } = require("./api");

const API_BASE_URL = 'https://api.accstool.com';

let mainWindow;
let macAddress = null;
let ws = null;

// Load URL blocking configuration
let blockedDomainPaths = {};

try {
    const configPath = path.join(__dirname, 'config', 'blocked-domains.json');
    blockedDomainPaths = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('Loaded blocked domains configuration');
} catch (error) {
    console.error('Error loading blocked domains configuration:', error);
}

// Function to check if a URL is blocked
const isBlocked = (url) => {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const pathname = urlObj.pathname.toLowerCase();

        // Check if domain exists in blocked list
        if (blockedDomainPaths[domain]) {
            // Check if any blocked path matches
            return blockedDomainPaths[domain].some(blockedPath => 
                pathname.startsWith('/' + blockedPath)
            );
        }

        return false;
    } catch (error) {
        console.error('Error checking URL:', error);
        return false;
    }
};

// Function to intercept requests and block specific URLs
const setupUrlBlocking = () => {
    // Block navigation to blocked URLs
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
        if (isBlocked(details.url)) {
            console.log(`Blocked URL: ${details.url}`);
            callback({ cancel: true });
        } else {
            callback({ cancel: false });
        }
    });
};

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

// Function to load all extensions from a directory
const loadExtensions = async (extensionsDir) => {
    try {
        const extensions = fs.readdirSync(extensionsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(extensionsDir, dirent.name));

        for (const extensionPath of extensions) {
            try {
                await session.defaultSession.loadExtension(extensionPath, {
                    allowFileAccess: true
                });
                console.log(`Loaded extension from: ${extensionPath}`);
            } catch (error) {
                console.error(`Error loading extension from ${extensionPath}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading extensions:', error);
    }
};

app.whenReady().then(() => {
    // Setup URL blocking
    setupUrlBlocking();
    
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

    // Handle password reset request
    ipcMain.handle('request-new-password', async (event, email) => {
        try {
            const result = await requestNewPassword(email);
            console.log('Password reset request successful:', result);
            return result;
        } catch (error) {
            console.error('Error requesting password reset:', error);
            if (error.response) {
                throw error.response.data || 'Server error occurred';
            } else if (error.request) {
                throw 'No response from server. Please check your internet connection.';
            } else {
                throw error.message || 'An unexpected error occurred';
            }
        }
    });

    ipcMain.handle("open-url-with-cookies", async (event, { url, cookies }) => {
        try {
            // Load extensions from accs folder
            const extensionsPath = path.join(__dirname, 'accs');
            await loadExtensions(extensionsPath);

            const newWindow = new BrowserWindow({
                width: 1024,
                height: 768,
                webPreferences: {
                    contextIsolation: true,
                    nodeIntegration: false,
                    webSecurity: true,
                    allowRunningInsecureContent: false,
                    plugins: true,
                    experimentalFeatures: true
                }
            });

            // Set cookies before loading URL
            await setDynamicCookies(cookies, url);

            // Add navigation handler to check URLs before loading
            newWindow.webContents.on('will-navigate', (event, navUrl) => {
                if (isBlocked(navUrl)) {
                    event.preventDefault();
                    newWindow.webContents.executeJavaScript(`
                        alert('Stay on this page.....');
                    `);
                }
            });

            // Also handle new window creation
            newWindow.webContents.setWindowOpenHandler(({ url }) => {
                if (isBlocked(url)) {
                    newWindow.webContents.executeJavaScript(`
                        alert('This URL has been blocked by administrator: ${url}');
                    `);
                    return { action: 'deny' };
                }
                return { action: 'allow' };
            });

            // Check initial URL
            if (isBlocked(url)) {
                newWindow.loadFile('index.html');  // Load main page instead
                newWindow.webContents.once('did-finish-load', () => {
                    newWindow.webContents.executeJavaScript(`
                        alert('This URL has been blocked by administrator: ${url}');
                    `);
                });
            } else {
                try {
                    await newWindow.loadURL(url, {
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    });
                    console.log("URL loaded successfully with cookies and extensions");
                } catch (error) {
                    console.error("Error loading URL:", error);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error opening URL:', error);
            throw error;
        }
    });

    ipcMain.handle("get-mac-address", () => macAddress); // Expose MAC address to renderer
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});