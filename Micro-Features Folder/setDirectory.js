
// Import Relevant (Built-in) Node.js Libraries
const fs = require('fs');

const folderName = "./downloadedFiles";

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}