
/* 
    Import components of the Electron Module:
        1. app: Controls the App's Event Lifecycle (Not sure what that is...)
        2. BrowserWindow: Generates + Manages App windows
*/

const { app, BrowserWindow } = require("electron");

// Generate a BrowserWindow, using the HTML file
const createWindow = function() {
    const win = new BrowserWindow(
        {
            width: 750,
            height: 500
        }
    );
    win.loadFile("./frontend/home.html");

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
