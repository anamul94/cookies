const { app, BrowserWindow, ipcMain, session, shell } = require("electron");
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
let store = null;

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
        console.log('Domain:', domain);

        // Block the entire domain if it's in the blocked list
        if (blockedDomainPaths[domain]) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
};

// Function to intercept requests and block specific URLs
const setupUrlBlocking = () => {
    // Block all types of requests for blocked URLs
    const filter = {
        urls: ['*://*/*']
    };

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        if (isBlocked(details.url)) {
            callback({ cancel: true });
        } else {
            callback({ cancel: false });
        }
    });

    // Block navigation events
    session.defaultSession.webRequest.onBeforeRedirect(filter, (details) => {
        isBlocked(details.redirectURL);
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

// Function to save credentials
const saveCredentials = async (email, password) => {
    if (!store) return;
    store.set('credentials', { email, password });
};

// Function to get saved credentials
const getSavedCredentials = () => {
    if (!store) return { email: '', password: '' };
    return store.get('credentials') || { email: '', password: '' };
};

app.whenReady().then(async () => {
    // Initialize electron-store
    const Store = await import('electron-store');
    store = new Store.default();

    // Setup URL blocking
    setupUrlBlocking();

    macAddress = getMacAddress();

    if (!macAddress || macAddress === "00:00:00:00:00:00") {
        console.error("Invalid MAC address");
        app.quit();
        return;
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
            devTools: false
        }
    });

    // Disable DevTools globally
    mainWindow.webContents.on('before-input-event', (event, input) => {
        // Prevent DevTools shortcuts
        if ((input.control || input.meta) && input.key.toLowerCase() === 'i' ||  // Ctrl/Cmd + I
            (input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i' ||  // Ctrl/Cmd + Shift + I
            input.key === 'F12') {  // F12
            event.preventDefault();
        }
    });

    // Disable context menu to prevent right-click inspect
    mainWindow.webContents.on('context-menu', (e) => {
        e.preventDefault();
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

            // Add navigation controls
            newWindow.webContents.on('did-finish-load', () => {
                newWindow.webContents.executeJavaScript(`
                    if (!document.getElementById('nav-controls')) {
                        const controls = document.createElement('div');
                        controls.id = 'nav-controls';
                        controls.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #f5f5f5; padding: 8px; z-index: 9999; border-bottom: 1px solid #ddd; display: flex; gap: 8px;';
                        
                        const backBtn = document.createElement('button');
                        backBtn.innerText = '←';
                        backBtn.title = 'Back';
                        backBtn.style.cssText = 'padding: 4px 12px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;';
                        backBtn.onclick = () => history.back();
                        
                        const forwardBtn = document.createElement('button');
                        forwardBtn.innerText = '→';
                        forwardBtn.title = 'Forward';
                        forwardBtn.style.cssText = 'padding: 4px 12px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;';
                        forwardBtn.onclick = () => history.forward();
                        
                        const reloadBtn = document.createElement('button');
                        reloadBtn.innerText = '↻';
                        reloadBtn.title = 'Reload';
                        reloadBtn.style.cssText = 'padding: 4px 12px; cursor: pointer; border: 1px solid #ddd; background: white; border-radius: 4px;';
                        reloadBtn.onclick = () => location.reload();
                        
                        controls.appendChild(backBtn);
                        controls.appendChild(forwardBtn);
                        controls.appendChild(reloadBtn);
                        document.body.insertBefore(controls, document.body.firstChild);
                        
                        // Add padding to body to prevent content from hiding under controls
                        document.body.style.marginTop = '40px';
                    }
                `);
            });

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

    ipcMain.handle('save-credentials', async (event, { email, password }) => {
        saveCredentials(email, password);
    });

    ipcMain.handle('get-credentials', async () => {
        return getSavedCredentials();
    });

    ipcMain.handle("get-mac-address", () => macAddress); // Expose MAC address to renderer

    // Handle opening external URLs
    ipcMain.handle('open-external-url', async (event, url) => {
        try {
            await shell.openExternal(url);
            return true;
        } catch (error) {
            console.error('Failed to open external URL:', error);
            return false;
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});