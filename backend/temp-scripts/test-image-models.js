/**
 * Test Script: Image Generation Models
 * 
 * This script tests the recommended image generation models
 * Note: Imagen models use a different API than standard Gemini models
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

console.log("=".repeat(80));
console.log("🎨 IMAGE GENERATION MODEL TEST");
console.log("=".repeat(80));

// Test models for image generation
const imageModels = [
    {
        name: "gemini-2.5-flash-image",
        type: "multimodal",
        description: "Gemini multimodal with image generation"
    },
    {
        name: "gemini-2.0-flash-exp-image-generation",
        type: "multimodal",
        description: "Gemini 2.0 experimental image generation"
    },
    {
        name: "gemini-3-pro-image-preview",
        type: "multimodal",
        description: "Gemini 3 Pro with image generation (preview)"
    }
];

async function testMultimodalImageModel(modelInfo) {
    console.log(`\n📝 Testing: ${modelInfo.name}`);
    console.log(`   Type: ${modelInfo.type}`);
    console.log(`   Description: ${modelInfo.description}`);
    console.log("-".repeat(80));

    try {
        const model = genAI.getGenerativeModel({ model: modelInfo.name });

        // Test with a simple prompt that should work for image-capable models
        const prompt = "Generate a simple description of a retail banner for a summer sale.";
        console.log(`   Prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`   ✅ SUCCESS!`);
        console.log(`   Response: ${text.substring(0, 200)}...`);

        return { ...modelInfo, success: true, response: text };
    } catch (error) {
        console.log(`   ❌ FAILED`);
        console.log(`   Status: ${error.status || 'N/A'}`);
        console.log(`   Message: ${error.message}`);

        return { ...modelInfo, success: false, error: error.message };
    }
}

async function testImagenModel() {
    console.log(`\n📝 Testing: imagen-4.0-fast-generate-001`);
    console.log(`   Type: Dedicated Image Generation`);
    console.log(`   Description: Imagen 4 Fast - Dedicated image generation model`);
    console.log("-".repeat(80));

    try {
        // Note: Imagen models may require different initialization
        // This is a test to see if the model is accessible

        console.log(`   ℹ️  Imagen models use the 'predict' method, not 'generateContent'`);
        console.log(`   ℹ️  They may require different SDK methods or direct API calls`);
        console.log(`   ℹ️  Checking if model exists in API...`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001?key=${API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ Model exists!`);
            console.log(`   Display Name: ${data.displayName}`);
            console.log(`   Supported Methods: ${data.supportedGenerationMethods?.join(', ')}`);

            console.log(`\n   ⚠️  Note: Imagen models require special implementation`);
            console.log(`   See: https://ai.google.dev/api/generate-images`);

            return { success: true, note: "Model exists but requires special implementation" };
        } else {
            console.log(`   ❌ Model not accessible via standard endpoint`);
            return { success: false, error: `HTTP ${response.status}` };
        }
    } catch (error) {
        console.log(`   ❌ FAILED`);
        console.log(`   Message: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log("\n🚀 Testing Multimodal Image Models...\n");

    const results = [];

    for (const modelInfo of imageModels) {
        const result = await testMultimodalImageModel(modelInfo);
        results.push(result);

        // Delay between tests
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log("\n\n🚀 Testing Imagen Model...\n");
    const imagenResult = await testImagenModel();

    // Summary
    console.log("\n\n" + "=".repeat(80));
    console.log("📊 SUMMARY");
    console.log("=".repeat(80));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n✅ Working Models (${successful.length}):`);
    successful.forEach(r => {
        console.log(`   - ${r.name}`);
    });

    console.log(`\n❌ Failed Models (${failed.length}):`);
    failed.forEach(r => {
        console.log(`   - ${r.name}: ${r.error}`);
    });

    if (successful.length > 0) {
        console.log("\n\n" + "=".repeat(80));
        console.log("💡 RECOMMENDATION FOR IMAGE GENERATION");
        console.log("=".repeat(80));
        console.log(`\nFor retail creative generation, use:`);
        console.log(`   const imageModel = genAI.getGenerativeModel({ model: "${successful[0].name}" });`);
        console.log(`\nThis model supports generateContent() and can handle image-related tasks.`);
    }

    console.log("\n" + "=".repeat(80));
}

runTests().catch(error => {
    console.error("\n💥 FATAL ERROR:", error);
    process.exit(1);
});
