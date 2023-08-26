const { app, BrowserWindow, ipcMain } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true
  })
  win.loadFile('./frontend/home.html')
}

app.whenReady().then(() => {
  createWindow()
  ipcMain.on("link", (link) => {
    downloadSong(link)
  })
})

function downloadSong(videoURL, videoID) {
    const ytdlp = spawn('yt-dlp', [
        `${videoURL}`,
        `-o ./${videoID}.%(ext)s`,
        '-N 10',
        '-f best',
        '--ffmpeg-location',
        './node_modules./ffmpeg-static/'
    ])

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