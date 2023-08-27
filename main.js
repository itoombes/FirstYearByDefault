const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process')
const path = require('path');

const yt = require('@googleapis/youtube')
const { apiKey } = require('./secrets.json')
const client = yt.youtube({
    version: 'v3',
    auth: apiKey
})


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

ipcMain.on("search", (event, query) => {
  // extract the relevant data
  console.log('rn')
  YouTubeQuery(query).then(results => event.reply("search", results))
});

async function YouTubeQuery(input) {
    const queryRes = await client.search.list({
        part: "snippet",
        q: input
    })
    let resultIndex = []
    queryRes.data.items.forEach(item => {
        vidTitle = item.snippet.title;
        vidChannel = item.snippet.channelTitle
        vidId = item.id.videoId;
        vidThumb = `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`
        let result = {
            title: vidTitle,
            channel: vidChannel,
            id: vidId,
            link: `https://youtube.com/watch?v=${vidId}`,
            thumb: vidThumb
        }
        resultIndex.push(result)
    })
    const videoRes = await client.videos.list({
        part: "contentDetails",
        id: `${resultIndex[0].id},${resultIndex[1].id},${resultIndex[2].id},${resultIndex[3].id},${resultIndex[4].id}`
    })
    console.log(videoRes.data.items.length)
    for (let i = 0; i < videoRes.data.items.length; i++) {
        vidDurationIso = videoRes.data.items[i].contentDetails.duration
        let vidDurationTiny = require('tinyduration').parse(vidDurationIso)
        let vidDurationSeconds = ((vidDurationTiny.hours ? vidDurationTiny.hours * 3600 : 0) + (vidDurationTiny.minutes ? vidDurationTiny.minutes * 60 : 0) + (vidDurationTiny.seconds ? vidDurationTiny.seconds : 0))
        let vidDuration = new Date(vidDurationSeconds * 1000).toISOString().substring(11, 19)
        resultIndex[i]['duration'] = vidDuration
    }
    console.log(resultIndex)
    return resultIndex
}

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