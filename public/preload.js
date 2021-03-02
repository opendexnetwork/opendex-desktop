const { clipboard, contextBridge, shell, remote } = require("electron");
const log = require("electron-log");
const { ipcRenderer } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");

contextBridge.exposeInMainWorld("electron", {
  platform: () => {
    return process.platform;
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  copyToClipboard: (value) => {
    clipboard.writeText(value);
  },
  openExternal: (url) => {
    shell.openExternal(url);
  },
  logError: (message) => {
    log.error(message);
  },
  logInfo: (message) => {
    log.info(message);
  },
  opendexDockerEnvExists: (network) => {
    const getPathFromHomeDir = (platform) => {
      switch (platform) {
        case "win32":
          return "AppData/Local/OpendexDocker";
        case "darwin":
          return "Library/Application Support/OpendexDocker";
        default:
          return ".opendex-docker";
      }
    };
    const pathFromHomedir = getPathFromHomeDir(process.platform);
    return fs.existsSync(
      path.join(
        os.homedir(),
        `${pathFromHomedir}/${network}/data/opendexd/nodekey.dat`
      )
    );
  },
  dialog: () => {
    return remote.dialog;
  },
  appVersion: () => {
    return remote.app.getVersion();
  },
});
