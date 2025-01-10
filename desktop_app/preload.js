const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    getActiveProducts: (email, password) => ipcRenderer.invoke("get-active-products", email, password),
    openUrlWithCookies: (url, cookies) =>
        ipcRenderer.invoke("open-url-with-cookies", { url, cookies }),
    getMacAddress: () => ipcRenderer.invoke("get-mac-address"),
    requestNewPassword: async (email) => {
        try {
            const response = await ipcRenderer.invoke('request-new-password', email);
            return response;
        } catch (error) {
            console.error('Error in requestNewPassword:', error);
            throw error;
        }
    },
    onUrlBlockedError: (callback) => ipcRenderer.on('url-blocked-error', (event, data) => callback(data)),
    saveCredentials: (email, password) => ipcRenderer.invoke('save-credentials', { email, password }),
    getSavedCredentials: () => ipcRenderer.invoke('get-credentials'),
    openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url)
});

contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => shell.openExternal(url)
});
