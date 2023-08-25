const yt = require('@googleapis/youtube')
const { spawn } = require('child_process')
const { apiKey } = require('./secrets.env')
const client = yt.youtube({
    version: 'v3',
    auth: apiKey
})
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question("Search on YouTube: ", query => {
    readline.pause()
    YouTubeQuery(query).then(index => SelectEntry(index))
})

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
    return resultIndex
};

function SelectEntry(index) {
    for (let i = 0; i < index.length; i++) {
        console.log(`Option ${i + 1}:`)
        console.log(index[i])
    }
    selectSong().then(selection => {
        let videoSelected = index[selection - 1]
        try {
            downloadSong(videoSelected.link)
        } catch (err) {
            console.log(err)
        }
    })
}

function selectSong() {
    const nums = ['1', '2', '3', '4', '5']
    return new Promise((resolve) => {
        readline.question("Please select (1/2/3/4/5): ", selection => {
            readline.pause()
            if (nums.includes(selection)) {
                resolve(selection)
            } else {
                resolve(selectSong())
            }
        })
    })
}

function downloadSong(songUrl) {
    const ytdlp = spawn('cmd.exe', [
        'cd resources',
        '/c',
        'yt-dlp',
        songUrl,
        '--force-overwrites',
        '-x',
        '--audio-format',
        'opus',
        '-o',
        'song.%(ext)s',
        '--ffmpeg-location',
        './resources'
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