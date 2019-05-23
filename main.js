const electron = require('electron');

// Module to control application life.
const app = electron.app;
// const { setup: setupPushReceiver } = require('electron-push-receiver');

// Module to create native browser window.
//const { autoUpdater } = require('electron-updater');

const path = require('path');
const url = require('url');
const isDev = require("electron-is-dev");
const menuBar = require('menubar');

const tray = menuBar({
    index: isDev ? "http://localhost:3000" : url.format({
        pathname: `file://${path.join(__dirname, "../build/index.html")}`,
        protocol: 'file:',
        // slashes: true,
    }),
    icon: path.join(__dirname, 'assets/iconTemplate.png'),
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 600,
    backgroundColor: '#312450',
    show: false,
    showDockIcon: true,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

    // setupPushReceiver(tray.window);
    tray.showWindow();
    //createMenu();
    tray.window.openDevTools();

    // require('devtron').install()
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Bắt sự kiện cửa sổ được đóng lại.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    console.log("app all closed........");
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function (e, isOpenWindow) {
    console.log("app activate........");
    // On OS X it's common to re-create a window in the app when the
    if (!isOpenWindow) {
        tray.showWindow();
    } else {
        tray.hideWindow();
    }
});

tray.on('show', () => {
    console.log("tray show.......");
    electron.globalShortcut.register('Escape', () => {
        if (tray.window && tray.window.isFocused()) {
            tray.window.blur(); // Need to reopen in windowOS
            tray.hideWindow(); // Need to reopen in macOS
        }
    });
});

tray.on('hide', () => {
    console.log("tray hide.......");
    /**
     * If you don't this, Escape key doesn't active another application.
     */
    electron.globalShortcut.unregister('Escape');
});
//  end init browser windows