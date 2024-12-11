const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openUrlWithCookies: (url, cookies) =>
        ipcRenderer.invoke("open-url-with-cookies", { url, cookies }),
});
