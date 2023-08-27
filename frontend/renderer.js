// function called when "Download" button is pressed
function sendInput() {
  // pull values from the UI
  option = document.getElementById("inputOption").value;
  video = document.getElementById("inputString").value;
  videoID = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.exec(video)[1] 
  console.log(videoID)

  // if the user hasn't input a string, stop the process
  if (videoID == "") {
    console.error("Invalid input string!");
    return 0;
  }

  // extract the format (vid/aud) and fileType from the dropdown
  format = option.split("-")[0]
  fileType = option.split("-")[1]
  
  // package the data into an object
  data = {
    videoID: videoID,
    format: format,
    fileType: fileType
  }

  // send this to the ipcMain process
  window.api.send("input", data);
  return 1;
}

function sendInputSearch() {
  // pull values from the UI
  query = document.getElementById("searchInput").value;

  // send this to the ipcMain process
  window.api.send("search", query);
  console.log(`pressed the button, data is ${query}`)
}

window.api.receive("search", (results) => {
  console.log(results)
})

// when ipcMain sends back a reply, log it
window.api.receive("reply", (reply) => {
  console.log(reply)
})

window.api.receive("output", (data) => {
  data = new TextDecoder().decode(data)
  if (data.startsWith('\r[download]')) {
    downloadInt = parseInt(data.split("of")[0].split("]")[1].split("%")[0].trim())
    progressWrapper = document.getElementById("progressWrapper")
    progressBar = document.getElementById("progressBar")
    downloadString = `${downloadInt}%`

    progressWrapper.ariaValueNow = downloadInt
    progressBar.style.width = downloadString
    progressBar.innerHTML = downloadString

    if (downloadInt == 100) {
      progressBar.classList.add("bg-success")
    } else if (downloadInt < 100) {
      progressBar.classList.remove("bg-success")
    }
    
  }
})