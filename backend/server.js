const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/generate/text', require('./routes/generateText'));
app.use('/generate/banner', require('./routes/generateBanner'));
app.use('/validate/specs', require('./routes/validateSpecs'));

app.get('/', (req, res) => {
  res.send('CodeChain Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
