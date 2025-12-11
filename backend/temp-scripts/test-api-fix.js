/**
 * Test Script: Verify Gemini API Fix
 * 
 * This script tests that the updated model name works correctly
 */

const { textModel, generateContentWithRetry } = require("../utils/geminiClient");

console.log("\n" + "=".repeat(80));
console.log("🧪 TESTING GEMINI API WITH UPDATED MODEL");
console.log("=".repeat(80));

async function testAPI() {
    try {
        console.log("\n📝 Test 1: Simple text generation");
        console.log("-".repeat(80));

        const prompt = "Say 'Hello from Gemini 2.5 Flash!' in a creative way.";
        console.log(`Prompt: "${prompt}"`);

        const result = await generateContentWithRetry(textModel, prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS!");
        console.log(`Response: ${text}`);
        console.log("\n" + "=".repeat(80));
        console.log("🎉 API is working correctly with gemini-2.5-flash!");
        console.log("=".repeat(80));

    } catch (error) {
        console.error("\n❌ TEST FAILED");
        console.error(`Status: ${error.status || 'N/A'}`);
        console.error(`Message: ${error.message}`);
        console.error("\n" + "=".repeat(80));
        process.exit(1);
    }
}

testAPI();
