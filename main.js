const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process')
const path = require('path');
const { sandboxed } = require('process');
const { once } = require('events');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
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
  url = data.videoURL;
  format = data.format;
  fileType = data.fileType;
  downloadVideo(url, format, fileType)
  event.reply("reply", `downloaded ${url}`)
});

function downloadVideo(videoURL, format, fileType) {
    videoID = videoURL.split("?v=")[1]
    options = []

    if (format == "ba" || format == "wa") {
      options = [
        `${videoURL}`,
        `-o downloads/${videoID}-${format}.%(ext)s`,
        '-N 10',
        '-f',
        `${format}`,
        '-x',
        '--audio-format',
        `${fileType}`,
        '--ffmpeg-location',
        './node_modules./ffmpeg-static/'
      ]
    } else {
      options = [
        `${videoURL}`,
        `-o downloads/${videoID}-${format}.%(ext)s`,
        '-N 10',
        '-f',
        `${format}`,
        '--remux-video'
        `${fileType}`,
        '--ffmpeg-location',
        './node_modules./ffmpeg-static/'
      ]
    }

    const ytdlp = spawn('yt-dlp', options)

    ytdlp.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    ytdlp.stderr.on('data', (data) => {
        console.error(data.toString())
    })

    ytdlp.on('exit', (code) => {
        console.log(`Exited with code ${code}`)
    })
}