/**
 * Test Script: Verify Description Formatting Fix
 * 
 * This script tests that product descriptions are generated without markdown formatting
 */

const { textModel, generateContentWithRetry } = require("../utils/geminiClient");

console.log("\n" + "=".repeat(80));
console.log("🧪 TESTING DESCRIPTION FORMATTING");
console.log("=".repeat(80));

async function testDescriptionFormat() {
    try {
        const name = "Trimmer for Men | Waterproof, Compact & Noiseless Electric Beard & Body Groomer";
        const features = [
            "Waterproof design",
            "Compact and portable",
            "Noiseless operation",
            "Precision trimming",
            "Long battery life"
        ];
        const platform = "Amazon";

        const prompt = `Generate a SEO-optimized product description for a product named "${name}" with the following features: ${features.join(', ')}. 

The description should be optimized for ${platform}.

IMPORTANT FORMATTING RULES:
- Write in clean, professional prose without any markdown formatting
- DO NOT use asterisks (**) for bold text
- DO NOT use special formatting characters
- Use natural paragraph breaks and proper punctuation
- Write clear, flowing sentences that read naturally
- The output should be ready to paste directly into an e-commerce platform

Return ONLY the description text, properly formatted with natural line breaks.`;

        console.log("\n📝 Test Product:");
        console.log(`   Name: ${name}`);
        console.log(`   Features: ${features.join(', ')}`);
        console.log(`   Platform: ${platform}`);
        console.log("\n" + "-".repeat(80));

        console.log("\n🚀 Generating description...\n");

        const result = await generateContentWithRetry(textModel, prompt);
        const response = await result.response;
        const description = response.text();

        console.log("✅ GENERATED DESCRIPTION:");
        console.log("=".repeat(80));
        console.log(description);
        console.log("=".repeat(80));

        // Check for markdown formatting
        const hasMarkdown = description.includes('**') || description.includes('##') || description.includes('###');

        console.log("\n📊 FORMATTING CHECK:");
        console.log("-".repeat(80));
        console.log(`Contains ** (bold): ${description.includes('**') ? '❌ YES (BAD)' : '✅ NO (GOOD)'}`);
        console.log(`Contains ## (headers): ${description.includes('##') ? '❌ YES (BAD)' : '✅ NO (GOOD)'}`);
        console.log(`Length: ${description.length} characters`);

        if (hasMarkdown) {
            console.log("\n⚠️  WARNING: Description still contains markdown formatting!");
            console.log("The AI may need additional prompting or post-processing.");
        } else {
            console.log("\n✅ SUCCESS: Description is clean and properly formatted!");
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

testDescriptionFormat();
