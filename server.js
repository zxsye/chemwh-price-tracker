const express = require('express');
const { spawn } = require('child_process');
const path = require('path'); // Import the path module

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public folder (CSS, JavaScript)
app.use(express.static('public'));

// Serve the HTML file from its new location (root folder)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Specify the correct path to your HTML file
});

app.get('/call-python-script', (req, res) => {
    const pythonProcess = spawn('python3', ['script.py']);

    pythonProcess.stdout.on('data', (data) => {
        const htmlTable = data.toString();
        res.send(htmlTable);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(data.toString());
        res.status(500).send('Error executing Python script');
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script process exited with code ${code}`);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
