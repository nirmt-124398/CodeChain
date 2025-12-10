require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const generateTextRouter = require('./routes/generateText');
const generateBannerRouter = require('./routes/generateBanner');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/generate-text', generateTextRouter);
app.use('/api/generate-banner', generateBannerRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
