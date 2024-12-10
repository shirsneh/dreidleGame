const express = require('express');
const app = express();
const path = require('path');

// Serve static files (HTML, CSS, JS, assets) from the project folder
app.use(express.static(path.join(__dirname)));

// Serve favicon.ico
app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
