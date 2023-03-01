import {
  app, protocol, BrowserWindow, Menu,
// eslint-disable-next-line import/no-extraneous-dependencies
} from 'electron';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const remote = require("@electron/remote/main")
remote.initialize()

const isDevelopment = process.env.NODE_ENV !== 'production';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);
// app.commandLine.appendSwitch("--disable-http-cache")
// app.commandLine.appendSwitch("--disable-gpu")
// app.disableHardwareAcceleration()
app.commandLine.appendSwitch('lang', 'zh-CN')
var win
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  setTimeout(() => {
    app.relaunch()
    app.quit()
  }, 100)
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
  app.quit()
})
async function createWindow() {
  // Don't do anything until the other instance die.
  if (!gotTheLock) { return }
  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 900,
    // frame: false,
    // transparent: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // for more info
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  remote.enable(win.webContents);
  win.setFullScreen(true);
  win.setSimpleFullScreen(true);
  Menu.setApplicationMenu(null);
  if (isDevelopment) {
    win.webContents.openDevTools({ mode: 'undocked' });
  }
  // eslint-disable-next-line global-require
  const { ipcMain } = require('electron');
  ipcMain.on('window-close', () => {
    win.close();
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      // eslint-disable-next-line import/no-extraneous-dependencies,no-console
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
