function sendInput() {
  option = document.getElementById("inputOption").value;
  video = document.getElementById("inputString").value;

  if (video == "") {
    console.log("Invalid input string!");
    return 0;
  }
  data = {
    videoURL: video,
    format: option
  }
  console.log(video);
  window.api.send("input", data);
  return 1;
}

window.api.receive("reply", (reply) => {
  console.log(reply)
})