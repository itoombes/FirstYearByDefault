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