/**
 * Test Script: Save Generated Image
 * 
 * This script generates an image and saves it to verify the full flow works
 */

const { genAI, generateContentWithRetry } = require("../utils/geminiClient");
const fs = require('fs');
const path = require('path');

console.log("\n" + "=".repeat(80));
console.log("🎨 TESTING FULL IMAGE GENERATION FLOW");
console.log("=".repeat(80));

async function testFullFlow() {
    try {
        const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        const prompt = `Create a professional retail banner for "Trimmer for Men - Waterproof & Compact".

Design a modern, eye-catching banner with:
- Bold product name
- Premium look and feel
- Vibrant colors
- Professional e-commerce style
- Size: 1080x1080px`;

        console.log("\n📝 Generating banner...\n");

        const result = await generateContentWithRetry(imageModel, prompt);
        const response = await result.response;

        console.log("✅ Response received!");

        // Extract image data
        let imageData = null;

        if (response.candidates && response.candidates[0]) {
            const parts = response.candidates[0].content?.parts || [];

            for (const part of parts) {
                if (part.inlineData) {
                    imageData = part.inlineData.data;
                    console.log("✅ Found image data!");
                    console.log("   MIME type:", part.inlineData.mimeType);
                    console.log("   Data size:", imageData.length, "characters (base64)");
                    break;
                }
            }
        }

        if (imageData) {
            const fileName = `test_banner_${Date.now()}.png`;
            const filePath = path.join(__dirname, '../uploads', fileName);

            const buffer = Buffer.from(imageData, 'base64');
            fs.writeFileSync(filePath, buffer);

            console.log("\n✅ IMAGE SAVED SUCCESSFULLY!");
            console.log("   File:", fileName);
            console.log("   Path:", filePath);
            console.log("   Size:", buffer.length, "bytes");
            console.log("   Size (MB):", (buffer.length / 1024 / 1024).toFixed(2), "MB");

            console.log("\n" + "=".repeat(80));
            console.log("🎉 SUCCESS! Image generation is working!");
            console.log("=".repeat(80));
            console.log("\nYou can find the generated image at:");
            console.log(`   ${filePath}`);

        } else {
            console.log("\n❌ No image data found in response");
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED");
        console.error(`Status: ${error.status || 'N/A'}`);
        console.error(`Message: ${error.message}`);
        process.exit(1);
    }
}

testFullFlow();
