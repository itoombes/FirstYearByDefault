function sendInput() {
  video = document.getElementById("inputString").value
  option = document.getElementById("inputOption").value
  data = {
    videoURL: video,
    format: option
  }
  console.log(video)
  window.api.send("input", data)
}

window.api.receive("reply", (reply) => {
  console.log(reply)
})