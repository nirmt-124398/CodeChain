/**
 * Test Script: Image Generation Capability
 * 
 * This script tests if gemini-2.5-flash-image actually generates images
 * or if it only describes images
 */

const { genAI, generateContentWithRetry } = require("../utils/geminiClient");
const fs = require('fs');
const path = require('path');

console.log("\n" + "=".repeat(80));
console.log("🎨 TESTING IMAGE GENERATION CAPABILITY");
console.log("=".repeat(80));

async function testImageGeneration() {
    try {
        const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        const prompt = `Generate a simple banner image for a retail product: "Summer Sale - 50% Off"
    
Make it colorful and eye-catching with a modern design.`;

        console.log("\n📝 Test Prompt:");
        console.log(prompt);
        console.log("\n" + "-".repeat(80));

        console.log("\n🚀 Generating...\n");

        const result = await generateContentWithRetry(imageModel, prompt);
        const response = await result.response;

        console.log("✅ Response received!");
        console.log("\n📦 RESPONSE STRUCTURE:");
        console.log("-".repeat(80));

        // Log the full response structure
        console.log("Response object keys:", Object.keys(response));

        if (response.candidates) {
            console.log("\nCandidates found:", response.candidates.length);

            response.candidates.forEach((candidate, idx) => {
                console.log(`\nCandidate ${idx + 1}:`);
                console.log("  Content:", candidate.content ? "Present" : "Missing");

                if (candidate.content && candidate.content.parts) {
                    console.log("  Parts:", candidate.content.parts.length);

                    candidate.content.parts.forEach((part, partIdx) => {
                        console.log(`\n  Part ${partIdx + 1}:`);
                        console.log("    Keys:", Object.keys(part));

                        if (part.text) {
                            console.log("    Type: TEXT");
                            console.log("    Text preview:", part.text.substring(0, 200));
                        }
                        if (part.inlineData) {
                            console.log("    Type: INLINE_DATA (IMAGE!)");
                            console.log("    MIME type:", part.inlineData.mimeType);
                            console.log("    Data length:", part.inlineData.data ? part.inlineData.data.length : 0);
                        }
                        if (part.fileData) {
                            console.log("    Type: FILE_DATA (IMAGE URL!)");
                            console.log("    File URI:", part.fileData.fileUri);
                        }
                    });
                }
            });
        }

        // Try to get text response
        try {
            const text = response.text();
            console.log("\n📝 TEXT RESPONSE:");
            console.log("-".repeat(80));
            console.log(text.substring(0, 500));
        } catch (e) {
            console.log("\n⚠️  No text response available");
        }

        console.log("\n\n" + "=".repeat(80));
        console.log("📊 CONCLUSION");
        console.log("=".repeat(80));

        let hasImage = false;
        if (response.candidates && response.candidates[0]) {
            const parts = response.candidates[0].content?.parts || [];
            hasImage = parts.some(p => p.inlineData || p.fileData);
        }

        if (hasImage) {
            console.log("✅ Model DOES generate images!");
            console.log("   The banner generation should work.");
        } else {
            console.log("❌ Model DOES NOT generate images.");
            console.log("   It only generates text descriptions of images.");
            console.log("\n💡 ALTERNATIVE SOLUTIONS:");
            console.log("   1. Use Imagen API directly (requires different implementation)");
            console.log("   2. Use a text-to-image service (Stability AI, DALL-E, etc.)");
            console.log("   3. Generate placeholder images with text overlays using Node.js libraries");
        }

        console.log("\n" + "=".repeat(80));

    } catch (error) {
        console.error("\n❌ TEST FAILED");
        console.error(`Status: ${error.status || 'N/A'}`);
        console.error(`Message: ${error.message}`);
        console.error("\n" + "=".repeat(80));
        process.exit(1);
    }
}

testImageGeneration();
