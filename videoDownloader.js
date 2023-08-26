const yt = require('@googleapis/youtube')
const { spawn } = require('child_process')
const { apiKey } = require('./secrets.json')

// This is a client instance of the YouTube API
const client = yt.youtube({
    version: 'v3',
    auth: apiKey
})

// Readline is a nodeJS interface for entering information; this will be sunsetted for the UI
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// This prompts the user via the command prompt to enter search terms for the video
readline.question("Search on YouTube: ", userInput => {
    readline.pause()
    YouTubeQuery(userInput).then(resultList => SelectEntry(resultList))
})

// A helper function which calls the YouTube API and returns the 5 most relevant results
async function YouTubeQuery(input) {

    // using the provided input string, makes a G-API request using the "snippet" param
    const queryResponse = await client.search.list({
        part: "snippet",
        q: input
    })

    // adds each item returned by queryResponse to a list
    let resultList = []
    queryResponse.data.items.forEach(item => {
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
        resultList.push(result)
    })
    
    // sends a second request to the API for the duration of each video
    const videoResponse = await client.videos.list({
        part: "contentDetails",
        id: `${resultList[0].id},${resultList[1].id},${resultList[2].id},${resultList[3].id},${resultList[4].id}`
    })

    // formats each duration into standard HH:MM:SS format
    for (let i = 0; i < videoResponse.data.items.length; i++) {
        vidDurationIso = videoResponse.data.items[i].contentDetails.duration
        let vidDurationTiny = require('tinyduration').parse(vidDurationIso)
        let vidDurationSeconds = ((vidDurationTiny.hours ? vidDurationTiny.hours * 3600 : 0) + (vidDurationTiny.minutes ? vidDurationTiny.minutes * 60 : 0) + (vidDurationTiny.seconds ? vidDurationTiny.seconds : 0))
        let vidDuration = new Date(vidDurationSeconds * 1000).toISOString().substring(11, 19)
        resultList[i]['duration'] = vidDuration
    }
    return resultList
};

// prints the selections to the console; will be sunsetted for the UI
function SelectEntry(resultList) {
    for (let i = 0; i < resultList.length; i++) {
        console.log(`Option ${i + 1}:`)
        console.log(resultList[i])
    }
    selectSong().then(selection => {
        let selectedVideo = resultList[selection - 1]
        try {
            downloadSong(selectedVideo.link, selectedVideo.id)
        } catch (err) {
            console.log(err)
        }
    })
}

// selects the song based on input from the 
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

// downloads the selected video to a local directory
function downloadSong(videoURL, videoID) {
    const ytdlp = spawn('yt-dlp', [
        `${videoURL}`,
        `-o ./${videoID}.%(ext)s`,
        '-N 10',
        '-f best',
        '--ffmpeg-location',
        './node_modules/ffmpeg-static/'
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