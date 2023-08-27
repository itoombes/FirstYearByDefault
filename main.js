const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process')
const path = require('path');

browserOptions = {
  width: 1200,
  height: 800,
  autoHideMenuBar: true,
  title: "download from youtube, easily",
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
  }
}

var win = null
// Creates a window and loads a document within it
const createWindow = () => {
  win = new BrowserWindow(browserOptions);
  win.loadFile('./frontend/index.html');
  return win
}

app.whenReady().then(() => {
  createWindow();
});

// when data is received from the ipcRenderer process
ipcMain.on("input", (event, data) => {
  // extract the relevant data
  id = data.videoID;
  url = `https://youtube.com/watch?v=${data.videoID}`;
  format = data.format;
  fileType = data.fileType;
  
  // send a download request to yt-dlp
  downloadVideo(url, id, format, fileType)

  // send a confirmation message back to the ipcRenderer
  event.reply("reply", `attempting download with parameters ${format}/${fileType}...`)
});

function downloadVideo(videoURL, videoID, format, fileType) {
    // adjust the yt-dlp arguments based on user input
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
        './node_modules/ffmpeg-static/'
      ]
    } else {
      options = [
        `${videoURL}`,
        `-o downloads/${videoID}-${format}.%(ext)s`,
        '-N 10',
        '-f',
        `${format}`,
        '--remux-video',
        `${fileType}`,
        '--ffmpeg-location',
        './node_modules/ffmpeg-static/'
      ]
    }

    const ytdlp = spawn('yt-dlp', options)

    ytdlp.stdout.on('data', (data) => {
        win.webContents.send("output", data)
        console.log(data.toString())
    })

    ytdlp.stderr.on('data', (data) => {
        win.webContents.send("output", data)
        console.error(data.toString())
    })

    ytdlp.on('exit', (code) => {
        console.log(`Exited with code ${code}`)
    })
}