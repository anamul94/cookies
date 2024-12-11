const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

let mainWindow;

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

    // Set cookies for the new window
    const cookiePromises = cookies.map((cookie) => {
        const cookieDetails = {
            url: url,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || "/",
            secure: cookie.secure || false,
            httpOnly: cookie.httpOnly || false,
            expirationDate: cookie.expirationDate || (Date.now() / 1000 + 3600), // Default 1-hour expiration
            sameSite: cookie.sameSite || "lax",
        };
        return session.defaultSession.cookies.set(cookieDetails);
    });

    try {
        await Promise.all(cookiePromises);
        console.log("Cookies set successfully!");
    } catch (error) {
        console.error("Failed to set cookies:", error);
    }

    // Open the URL
    newWindow.loadURL(url);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
