const https = require('https');
const http = require('http');
const zlib = require('zlib');

class MCPClient {
    constructor() {
        this.isConnected = true; // Always ready since we're using direct HTTP
        console.log('🔌 MCP Client initialized (using direct HTTP fetch)');
        console.log('='.repeat(80));
    }

    async connect() {
        // No-op since we're using direct HTTP requests
        this.isConnected = true;
    }

    async fetchWebContent(url) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`🌐 MCP: Fetching content from ${url}...`);

                const urlObj = new URL(url);
                const protocol = urlObj.protocol === 'https:' ? https : http;

                const options = {
                    hostname: urlObj.hostname,
                    path: urlObj.pathname + urlObj.search,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept-Encoding': 'gzip, deflate'
                    },
                    timeout: 5000 // 5 second timeout
                };

                const req = protocol.request(options, (res) => {
                    const chunks = [];

                    // Handle compressed responses
                    let stream = res;
                    const encoding = res.headers['content-encoding'];

                    if (encoding === 'gzip') {
                        stream = res.pipe(zlib.createGunzip());
                        console.log('Gzip compression detected');
                    } else if (encoding === 'deflate') {
                        stream = res.pipe(zlib.createInflate());
                        console.log('Deflate compression detected');
                    }

                    stream.on('data', (chunk) => {
                        chunks.push(chunk);
                        // Limit data to prevent memory issues
                        const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
                        if (totalLength > 100000) {
                            req.destroy();
                            const data = Buffer.concat(chunks).toString('utf8');
                            resolve(data.substring(0, 100000));
                        }
                    });

                    stream.on('end', () => {
                        const data = Buffer.concat(chunks).toString('utf8');
                        console.log(`✅ MCP: Content fetched successfully (${data.length} chars)`);
                        resolve(data);
                    });

                    stream.on('error', (error) => {
                        // Ignore "unexpected end of file" - data already received
                        if (error.message.includes('unexpected end of file')) {
                            return; // Silently ignore, data already captured
                        }
                        console.error(`❌ MCP: Decompression error:`, error.message);
                        resolve(null);
                    });
                });

                req.on('error', (error) => {
                    console.error(`❌ MCP: Failed to fetch ${url}:`, error.message);
                    resolve(null);
                });

                req.on('timeout', () => {
                    req.destroy();
                    console.error(`❌ MCP: Timeout fetching ${url}`);
                    resolve(null);
                });

                req.end();
            } catch (error) {
                console.error(`❌ MCP: Error fetching ${url}:`, error.message);
                resolve(null);
            }
        });
    }

    async fetchPlatformGuidelines(platform) {
        const guidelineUrls = {
            amazon: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=200414280',
            flipkart: 'https://seller.flipkart.com/listing-quality',
            meta: 'https://www.facebook.com/business/help/980593902051460'
        };

        const url = guidelineUrls[platform.toLowerCase()];
        if (!url) {
            console.log(`⚠️  MCP: No guideline URL for platform: ${platform}`);
            return null;
        }

        const content = await this.fetchWebContent(url);

        if (!content) {
            return null;
        }

        // Extract text content from HTML (simple approach)
        // Remove HTML tags and extract meaningful text
        const textContent = content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
            .replace(/<[^>]+>/g, ' ') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        return textContent;
    }

    async disconnect() {
        // No-op for HTTP-based implementation
        this.isConnected = false;
        console.log('🔌 MCP Client disconnected');
    }
}

// Create singleton instance
const mcpClient = new MCPClient();

// Graceful shutdown
process.on('SIGINT', async () => {
    await mcpClient.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await mcpClient.disconnect();
    process.exit(0);
});

module.exports = mcpClient;
