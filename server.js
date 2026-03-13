const express = require('express');
const path = require('path');

const app = express();
// serve static files from project root
app.use(express.static(path.join(__dirname, '.')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Frontend running on http://localhost:${port}`));
