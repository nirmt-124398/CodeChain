/**
 * Quick Test: List Available Gemini Models
 */

require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("API Key:", API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log("\nFetching available models...\n");

async function listModels() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP ${response.status}: ${response.statusText}`);
            console.error("Response:", errorText);
            return;
        }

        const data = await response.json();

        console.log("✅ Available Models:\n");

        if (data.models && Array.isArray(data.models)) {
            data.models.forEach((model, index) => {
                console.log(`${index + 1}. ${model.name}`);
                console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                console.log();
            });

            // Find models that support generateContent
            const contentModels = data.models.filter(m =>
                m.supportedGenerationMethods?.includes('generateContent')
            );

            console.log("\n📝 Models supporting generateContent:");
            contentModels.forEach(m => console.log(`   - ${m.name}`));

            if (contentModels.length > 0) {
                const recommendedModel = contentModels[0].name.replace('models/', '');
                console.log(`\n💡 RECOMMENDED: Use "${recommendedModel}" in geminiClient.js`);
            }
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

listModels();
