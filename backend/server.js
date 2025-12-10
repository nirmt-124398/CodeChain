require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const imageModel = {
  async generateImage(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text']
      }
    });

    const parts = response.response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image generated');
  }
};

// Routes
app.post('/api/generate-banner', async (req, res, next) => {
  try {
    const { name, platform, bannerSize } = req.body;

    if (!name || !platform || !bannerSize) {
      return res.status(400).json({ error: 'name, platform, and bannerSize are required' });
    }

    const prompt = `Create a professional banner image for "${name}" on ${platform} platform. Banner size: ${bannerSize}. Make it visually appealing and suitable for the platform.`;

    const base64Image = await imageModel.generateImage(prompt);

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-banner.png`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));

    const bannerPath = `uploads/${filename}`;

    res.json({ bannerPath });
  } catch (error) {
    next(error);
  }
});

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
