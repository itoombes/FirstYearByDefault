const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process')
const path = require('path');
const { sandboxed } = require('process');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    title: "download from youtube, easily",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
  });
  win.loadFile('./frontend/index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on("input", (event, data) => {
  url = data.videoURL
  format = data.format
  downloadVideo(url, format).then(
    event.reply("reply", `downloaded ${url}`)
  );
});

async function downloadVideo(videoURL, format) {
    videoID = videoURL.split("?v=")[1]
    const ytdlp = spawn('yt-dlp', [
        `${videoURL}`,
        `-o downloads/${videoID}.%(ext)s`,
        '-N 10',
        `-f ${format}`,
        '--ffmpeg-location',
        './node_modules./ffmpeg-static/'
    ])

    await ytdlp.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    await ytdlp.stderr.on('data', (data) => {
        console.error(data.toString())
    })

    await ytdlp.on('exit', (code) => {
        console.log(`Exited with code ${code}`)
    })
}