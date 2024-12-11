const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

let mainWindow;

// Function to set dynamic cookies
const setDynamicCookies = async (cookies, url) => {
    const cookiePromises = cookies.map((cookie) => {
        // Start with the URL (mandatory for Electron)
        const cookieDetails = { url };

        // Dynamically add all fields from the provided cookie object
        Object.keys(cookie).forEach((key) => {
            cookieDetails[key] = cookie[key];
        });

        // Handle missing required fields or defaults
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

app.whenReady().then(() => {
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
});

// Listen for URL and cookies from the renderer process
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

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
