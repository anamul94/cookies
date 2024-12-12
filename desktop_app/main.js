const { app, BrowserWindow, ipcMain, session } = require("electron");
const axios = require("axios");
const path = require("path");

let mainWindow;

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

    ipcMain.handle("get-active-products", async (event, customerEmail) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/order/products?customerEmail=${encodeURIComponent(
                    customerEmail
                )}`
            );
            return response.data.activeProducts;
        } catch (error) {
            console.error("Error fetching data from API:", error);
            return [];
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
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
