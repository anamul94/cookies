const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getActiveProducts: (email, password) => ipcRenderer.invoke("get-active-products", email, password),
    openUrlWithCookies: (url, cookies) =>
        ipcRenderer.invoke("open-url-with-cookies", { url, cookies }),
    getMacAddress: () => ipcRenderer.invoke("get-mac-address"),
    requestNewPassword: (email) => ipcRenderer.invoke("request-new-password", email),
});