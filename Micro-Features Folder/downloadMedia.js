// Spawn the Console Instance
const { spawn } = require("child_process");


function dispStatus(c_process) {
    c_process.stdout.on(
        "data", 
        function(data) {
            console.log(`Output: ${data}`);
        }
    );
    
    c_process.stderr.on(
        "data", 
        function(data) {
            console.log(`Output: ${data}`);
        }
    );
    
    c_process.on(
        "error", 
        function(data) {
            console.log(`Output: ${data}`);
        }
    );
    
    c_process.on(
        "close", 
        function (code) {
            console.log(`Exited with code ${code}`);
        }
    );
}


function audioDownload(url, format = "mp3") {
    
    const x = spawn(
        "yt-dlp",
        [
            '-x',
            '--audio-format',
            `${format}`,
            `${url}`
        ]
    );
    dispStatus(x);

}

function videoDownload(url, format = "mp4") {
    
    const x = spawn(
        "yt-dlp",
        [
            '-f',
            `${format}`,
            `${url}`
        ]
    );
    dispStatus(x);

}

// For comments, description, subtitles, thumbnails
function metaDownload(url, metaData="thumbnails") {
    
    const x = spawn(
        "yt-dlp",
        [
            '-x',
            '--audio-format',
            `${format}`,
            `${url}`
        ]
    );
    dispStatus(x);

}

videoDownload("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "mp4");
