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

// when ipcMain sends back a reply, log it
window.api.receive("reply", (reply) => {
  console.log(reply)
})

window.api.receive("output", (data) => {
  data = new TextDecoder().decode(data)
  if (data.startsWith('\r[download]')) {
    downloadInfo = parseInt(data.split("of")[0].split("]")[1].split("%")[0].trim())
    console.log(downloadInfo)
    document.getElementById("progressBar").style.width = downloadInfo + "%"
    document.getElementById("progressBar").ariaValueNow = downloadInfo
    
  }
})