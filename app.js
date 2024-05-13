const express = require('express');
const requestIp = require('request-ip');
const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const app = express();
app.use(requestIp.mw());

const octokit = new Octokit({ 
  auth: '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',
  request: {
    fetch: fetch
  }
});

// Serve HTML file with form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.post('/upload', async (req, res) => {
  const { text } = req.body;
  const ipAddress = req.clientIp;

  try {
    // Generate a random file name
    const fileName = generateFileName();

    // Create file in GitHub repository
    await createFileInGitHub(fileName, text, ipAddress);

    // Save text to a local .txt file
    saveTextToLocalFile(fileName, text);

    // Return URL to the user
    const fileURL = `https://file.lykhost.link/temp/${fileName}.txt`;
    res.send(`${fileURL}`);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error uploading file');
  }
});

// Function to generate a random file name
function generateFileName() {
  const ramidesNumber = Math.floor(Math.random() * 1000);
  const randomLetters = generateRandomLetters(3); // Generate 5 random letters
  return `lykcloud_${ramidesNumber}-${randomLetters}`;
}

// Function to generate random letters
function generateRandomLetters(length) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

// Function to create file in GitHub repository
async function createFileInGitHub(fileName, text, ipAddress) {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: 'OKBOTS',
    repo: 'files-public',
    path: `a/${fileName}.txt`,
    message: `Added by ${ipAddress}`,
    content: Buffer.from(text).toString('base64'),
  });
}

// Function to save text to a local .txt file
function saveTextToLocalFile(fileName, text) {
  fs.writeFileSync(`${fileName}.txt`, text);
}

// Function to delete files starting with "file_"
function deleteFilesStartingWithFile() {
  fs.readdir(__dirname, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
    files.forEach(file => {
      if (file.startsWith('lykcloud_') && file.endsWith('.txt')) {
        fs.unlinkSync(file);
        console.log(`Deleted file: ${file}`);
      }
    });
  });
}

// Delete files every 20 seconds
setInterval(deleteFilesStartingWithFile, 20000);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
