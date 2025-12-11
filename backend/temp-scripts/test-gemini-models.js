/**
 * Diagnostic Script: Test Gemini API Models
 * 
 * This script tests different Gemini model names and API configurations
 * to resolve the 404 error with gemini-1.5-flash
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("=".repeat(80));
console.log("🔍 GEMINI API MODEL DIAGNOSTIC SCRIPT");
console.log("=".repeat(80));
console.log(`API Key: ${API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET'}`);
console.log("=".repeat(80));

// List of model names to test
const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-flash",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-pro",
];

async function testModel(modelName) {
    console.log(`\n📝 Testing model: ${modelName}`);
    console.log("-".repeat(80));

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = "Say hello in one word.";
        console.log(`   Prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`   ✅ SUCCESS!`);
        console.log(`   Response: ${text}`);
        return { modelName, success: true, response: text };
    } catch (error) {
        console.log(`   ❌ FAILED`);
        console.log(`   Status: ${error.status || 'N/A'}`);
        console.log(`   Message: ${error.message}`);

        // Log detailed error information
        if (error.errorDetails) {
            console.log(`   Error Details:`, JSON.stringify(error.errorDetails, null, 2));
        }

        return { modelName, success: false, error: error.message, status: error.status };
    }
}

async function listAvailableModels() {
    console.log("\n\n" + "=".repeat(80));
    console.log("📋 ATTEMPTING TO LIST AVAILABLE MODELS");
    console.log("=".repeat(80));

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Try to list models using the SDK
        console.log("Attempting to list models via SDK...");

        // Note: The SDK might not have a direct listModels method
        // We'll try making a direct API call instead
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        console.log("\n✅ Available Models:");
        console.log("-".repeat(80));

        if (data.models && Array.isArray(data.models)) {
            data.models.forEach((model, index) => {
                console.log(`\n${index + 1}. ${model.name}`);
                console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                console.log(`   Description: ${model.description || 'N/A'}`);
                console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            });

            return data.models;
        } else {
            console.log("No models found in response");
            return [];
        }
    } catch (error) {
        console.log(`❌ Failed to list models`);
        console.log(`   Error: ${error.message}`);
        return null;
    }
}

async function runDiagnostics() {
    console.log("\n\n" + "=".repeat(80));
    console.log("🚀 STARTING MODEL TESTS");
    console.log("=".repeat(80));

    const results = [];

    for (const modelName of modelsToTest) {
        const result = await testModel(modelName);
        results.push(result);

        // Add a small delay between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // List available models
    const availableModels = await listAvailableModels();

    // Summary
    console.log("\n\n" + "=".repeat(80));
    console.log("📊 SUMMARY");
    console.log("=".repeat(80));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n✅ Successful Models (${successful.length}):`);
    successful.forEach(r => {
        console.log(`   - ${r.modelName}`);
    });

    console.log(`\n❌ Failed Models (${failed.length}):`);
    failed.forEach(r => {
        console.log(`   - ${r.modelName} (${r.status || 'N/A'}): ${r.error}`);
    });

    if (successful.length > 0) {
        console.log("\n\n" + "=".repeat(80));
        console.log("💡 RECOMMENDATION");
        console.log("=".repeat(80));
        console.log(`Use this model in your geminiClient.js:`);
        console.log(`   const textModel = genAI.getGenerativeModel({ model: "${successful[0].modelName}" });`);
    }

    console.log("\n" + "=".repeat(80));
}

// Run the diagnostics
runDiagnostics().catch(error => {
    console.error("\n💥 FATAL ERROR:", error);
    process.exit(1);
});
