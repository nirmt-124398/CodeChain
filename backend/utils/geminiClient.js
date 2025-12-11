const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

console.log('🔧 Gemini Client Initialized');
console.log('   Model: gemini-2.5-flash');
console.log('   API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('='.repeat(80));

// Helper function to handle API calls with retry logic
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
  let lastError;

  console.log(`🔄 Starting API request with retry logic (max ${maxRetries} attempts)...`);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`\n📡 Attempt ${attempt + 1}/${maxRetries}...`);
      const result = await model.generateContent(prompt);
      console.log(`✅ Attempt ${attempt + 1} succeeded!`);
      return result;
    } catch (error) {
      lastError = error;

      console.error(`❌ Attempt ${attempt + 1} failed:`);
      console.error(`   Status: ${error.status} ${error.statusText || ''}`);
      console.error(`   Message: ${error.message}`);

      // Check if it's a rate limit error (429)
      if (error.status === 429) {
        // Extract retry delay from error if available
        let retryDelay = 1000 * Math.pow(2, attempt); // Default exponential backoff

        if (error.errorDetails) {
          const retryInfo = error.errorDetails.find(
            detail => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          );
          if (retryInfo && retryInfo.retryDelay) {
            // Parse retry delay (format: "20s")
            const delaySeconds = parseFloat(retryInfo.retryDelay);
            retryDelay = delaySeconds * 1000;
          }
        }

        if (attempt < maxRetries - 1) {
          console.log(`⏳ Rate limit hit. Retrying in ${retryDelay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        } else {
          console.error(`❌ All ${maxRetries} attempts exhausted. Rate limit persists.`);
        }
      } else {
        // If it's not a rate limit error, throw immediately
        console.error(`❌ Non-retryable error encountered. Throwing immediately.`);
        throw error;
      }
    }
  }

  // If all retries failed, throw the last error
  console.error(`\n❌ FINAL FAILURE: All retry attempts exhausted.`);
  throw lastError;
}

module.exports = {
  genAI,
  textModel,
  generateContentWithRetry,
};
