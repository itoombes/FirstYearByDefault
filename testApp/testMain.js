
/* 
    Import components of the Electron Module:
        1. app: Controls the App's Event Lifecycle
        2. BrowserWindow: Generates + Manages App windows
*/
const { app, BrowserWindow } = require("electron");

const createWindow = function() {
    const win = new BrowserWindow(
        {
            width: 800,
            height: 600
        }
    );
    win.loadFile("./testApp/testIndex.html");

    app.on(
        'activate', 
        function() {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
      }
    );
}

app.whenReady().then(
    function() {
        createWindow();
    }
);

app.on(
        'window-all-closed', function() {
            if (process.platform !== 'darwin') {
                app.quit()
            }
    }
)