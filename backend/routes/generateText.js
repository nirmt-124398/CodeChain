const express = require('express');
const router = express.Router();
const { textModel, generateContentWithRetry } = require('../utils/geminiClient');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
    try {
        const { name, productDescription, features, platform } = req.body;

        if (!name || !productDescription || !features || !platform) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('='.repeat(80));
        console.log('📝 TEXT GENERATION REQUEST');
        console.log('='.repeat(80));
        console.log('Product Name:', name);
        console.log('Product Description:', productDescription);
        console.log('Features:', features);
        console.log('Platform:', platform);
        console.log('Timestamp:', new Date().toISOString());
        console.log('-'.repeat(80));

        const prompt = `Generate a SEO-optimized product description for a product named "${name}" with the following features: ${features.join(', ')}. 

Product Details from User:
${productDescription}

The description should be optimized for ${platform}.

Use the user's product details as the foundation and enhance them with SEO-optimized language. Keep the core information accurate and don't hallucinate or make up features not mentioned.

IMPORTANT FORMATTING RULES:
- Write in clean, professional prose without any markdown formatting
- DO NOT use asterisks (**) for bold text
- DO NOT use special formatting characters
- Use natural paragraph breaks and proper punctuation
- Write clear, flowing sentences that read naturally
- The output should be ready to paste directly into an e-commerce platform

Return ONLY the description text, properly formatted with natural line breaks.`;

        console.log('🚀 Attempting API call to Gemini...');
        console.log('Model: gemini-1.5-flash');
        console.log('Prompt length:', prompt.length, 'characters');

        const result = await generateContentWithRetry(textModel, prompt);
        const response = await result.response;
        const description = response.text();

        console.log('✅ API call successful!');
        console.log('Response length:', description.length, 'characters');
        console.log('='.repeat(80));

        const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.txt`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        fs.writeFileSync(filePath, description);

        res.json({
            description,
            fileName,
            success: true,
            apiUsed: true
        });
    } catch (error) {
        console.error('='.repeat(80));
        console.error('❌ ERROR GENERATING TEXT');
        console.error('='.repeat(80));
        console.error('Error Type:', error.constructor.name);
        console.error('Error Message:', error.message);

        if (error.status) {
            console.error('HTTP Status:', error.status, error.statusText);
        }

        if (error.errorDetails) {
            console.error('\n📊 DETAILED ERROR INFORMATION:');
            console.error(JSON.stringify(error.errorDetails, null, 2));

            // Extract quota information
            const quotaFailure = error.errorDetails.find(
                d => d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure'
            );

            if (quotaFailure && quotaFailure.violations) {
                console.error('\n⚠️  QUOTA VIOLATIONS:');
                quotaFailure.violations.forEach((violation, idx) => {
                    console.error(`\nViolation ${idx + 1}:`);
                    console.error('  Metric:', violation.quotaMetric);
                    console.error('  Quota ID:', violation.quotaId);
                    if (violation.quotaDimensions) {
                        console.error('  Dimensions:', JSON.stringify(violation.quotaDimensions, null, 4));
                    }
                });
            }

            const retryInfo = error.errorDetails.find(
                d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
            );

            if (retryInfo) {
                console.error('\n⏱️  RETRY INFORMATION:');
                console.error('  Suggested delay:', retryInfo.retryDelay);
            }

            const helpInfo = error.errorDetails.find(
                d => d['@type'] === 'type.googleapis.com/google.rpc.Help'
            );

            if (helpInfo && helpInfo.links) {
                console.error('\n📚 HELP RESOURCES:');
                helpInfo.links.forEach(link => {
                    console.error(`  ${link.description}: ${link.url}`);
                });
            }
        }

        console.error('\n💡 DIAGNOSIS:');
        if (error.status === 429) {
            console.error('  → Your API key has EXCEEDED its quota limits');
            console.error('  → This is a REAL quota exhaustion, not a temporary issue');
            console.error('\n🔧 SOLUTIONS:');
            console.error('  1. Wait for quota reset (check error details above for timing)');
            console.error('  2. Create a NEW API key at: https://aistudio.google.com/apikey');
            console.error('  3. Upgrade to paid tier at: https://aistudio.google.com/');
            console.error('  4. Check usage at: https://ai.google.dev/usage?tab=rate-limit');
        } else {
            console.error('  → Unexpected error type');
            console.error('  → Check error details above for more information');
        }

        console.error('='.repeat(80));

        // Return detailed error to frontend
        if (error.status === 429) {
            return res.status(429).json({
                error: 'API quota exceeded',
                message: 'Your Gemini API key has exhausted its quota limits.',
                details: {
                    status: error.status,
                    statusText: error.statusText,
                    violations: error.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure')?.violations,
                    retryAfter: error.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay,
                },
                solutions: [
                    'Create a new API key at https://aistudio.google.com/apikey',
                    'Upgrade to paid tier for higher limits',
                    'Wait for quota reset (check retryAfter field)',
                    'Check current usage at https://ai.google.dev/usage'
                ]
            });
        }

        res.status(500).json({
            error: 'Failed to generate text',
            message: error.message,
            type: error.constructor.name
        });
    }
});

module.exports = router;
