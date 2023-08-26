function sendInput() {
  option = document.getElementById("inputOption").value;
  video = document.getElementById("inputString").value;

  if (video == "") {
    console.log("Invalid input string!");
    return 0;
  }
  format = option.split("-")[0]
  fileType = option.split("-")[1]
  data = {
    videoURL: video,
    format: format,
    fileType: fileType
  }
  console.log(data);
  window.api.send("input", data);
  return 1;
}

window.api.receive("reply", (reply) => {
  console.log(reply)
})