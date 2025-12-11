const express = require('express');
const router = express.Router();
const { genAI, generateContentWithRetry } = require('../utils/geminiClient');
const mcpClient = require('../utils/mcpClient');
const fs = require('fs');
const path = require('path');


router.post('/', async (req, res) => {
    try {
        const { name, productDescription, platform, bannerSize, features } = req.body;

        if (!name || !productDescription || !platform || !bannerSize) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('='.repeat(80));
        console.log('🎨 BANNER GENERATION REQUEST');
        console.log('='.repeat(80));
        console.log('Product Name:', name);
        console.log('Product Description:', productDescription);
        console.log('Platform:', platform);
        console.log('Banner Size:', bannerSize);
        console.log('Features:', features);
        console.log('Timestamp:', new Date().toISOString());
        console.log('-'.repeat(80));

        // Use the image generation model
        const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        // Fetch design guidelines using MCP (optional enhancement)
        let mcpDesignContext = '';
        try {
            console.log('🔍 MCP: Attempting to fetch design guidelines...');
            const guidelines = await mcpClient.fetchPlatformGuidelines(platform);
            if (guidelines) {
                mcpDesignContext = `\n\nDesign Guidelines Context (from ${platform}):\n${guidelines.substring(0, 800)}...\n`;
                console.log('✅ MCP: Successfully fetched design context');
            }
        } catch (error) {
            console.log('⚠️  MCP: Could not fetch guidelines, continuing without MCP context');
        }

        // Create a detailed prompt for banner generation
        const prompt = `Create a professional, eye-catching retail banner image for "${name}".

Product Details from User:
${productDescription}

Product Details:
- Name: ${name}
- Platform: ${platform}
- Features: ${features ? features.join(', ') : 'Premium quality product'}
- Banner Size: ${bannerSize}${mcpDesignContext}

Design Requirements:
- Modern, clean, and professional design
- Eye-catching colors that attract attention
- Clear product focus
- Suitable for ${platform} platform
- Include visual elements that represent the product based on the user's description
- Make it look premium and trustworthy
- Optimized for ${bannerSize} dimensions

Generate a high-quality banner image that would work well for e-commerce advertising.
Stay true to the user's product description - don't make up information or hallucinate features not mentioned.`;


        console.log('🚀 Attempting image generation...');
        console.log('Model: gemini-2.5-flash-image');
        console.log('Prompt length:', prompt.length, 'characters');

        const result = await generateContentWithRetry(imageModel, prompt);
        const response = await result.response;

        console.log('📦 Response received, processing...');

        // Check if response contains image data
        // The response might contain inline data or a URL
        let imageData = null;
        let imageUrl = null;

        // Try to extract image from response
        if (response.candidates && response.candidates[0]) {
            const candidate = response.candidates[0];

            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    // Check for inline data
                    if (part.inlineData) {
                        imageData = part.inlineData.data;
                        console.log('✅ Found inline image data');
                        break;
                    }
                    // Check for file data
                    if (part.fileData) {
                        imageUrl = part.fileData.fileUri;
                        console.log('✅ Found image URL:', imageUrl);
                        break;
                    }
                }
            }
        }

        const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_banner_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        if (imageData) {
            // Save base64 image data
            const buffer = Buffer.from(imageData, 'base64');
            fs.writeFileSync(filePath, buffer);
            console.log('✅ Banner saved successfully:', fileName);
            console.log('   File size:', buffer.length, 'bytes');
        } else if (imageUrl) {
            // Download from URL
            console.log('📥 Downloading image from URL...');
            const https = require('https');
            const file = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                https.get(imageUrl, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log('✅ Banner downloaded successfully:', fileName);
                        resolve();
                    });
                }).on('error', (err) => {
                    fs.unlink(filePath, () => { });
                    reject(err);
                });
            });
        } else {
            // Fallback: Model might not support image generation, create placeholder
            console.log('⚠️  No image data found in response');
            console.log('   Response text:', response.text ? response.text().substring(0, 200) : 'N/A');
            console.log('   Creating placeholder image...');

            // Create a simple colored placeholder
            const dummyContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
            fs.writeFileSync(filePath, dummyContent);

            console.log('⚠️  WARNING: Using placeholder image. The model may not support image generation.');
        }

        console.log('='.repeat(80));

        res.json({
            bannerPath: fileName,
            success: true,
            hasRealImage: !!(imageData || imageUrl)
        });

    } catch (error) {
        console.error('='.repeat(80));
        console.error('❌ ERROR GENERATING BANNER');
        console.error('='.repeat(80));
        console.error('Error Type:', error.constructor.name);
        console.error('Error Message:', error.message);

        if (error.status) {
            console.error('HTTP Status:', error.status, error.statusText);
        }

        console.error('='.repeat(80));

        res.status(500).json({
            error: 'Failed to generate banner',
            message: error.message
        });
    }
});

module.exports = router;

