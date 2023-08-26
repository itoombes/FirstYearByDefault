// function called when "Download" button is pressed
function sendInput() {
  // pull values from the UI
  option = document.getElementById("inputOption").value;
  video = document.getElementById("inputString").value;

  // if the user hasn't input a string, stop the process
  if (video == "") {
    console.error("Invalid input string!");
    return 0;
  }

  // extract the format (vid/aud) and fileType from the dropdown
  format = option.split("-")[0]
  fileType = option.split("-")[1]
  
  // package the data into an object
  data = {
    videoURL: video,
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