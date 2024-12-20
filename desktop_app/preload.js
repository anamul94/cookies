const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getActiveProducts: (email) => ipcRenderer.invoke("get-active-products", email),
    openUrlWithCookies: (url, cookies) =>
        ipcRenderer.invoke("open-url-with-cookies", { url, cookies }),
    getMacAddress: () => ipcRenderer.invoke("get-mac-address"), // New API to get MAC address
});
