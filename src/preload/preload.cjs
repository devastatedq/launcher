const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_event, data) => callback(data));
  },
  off: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});
