const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads');

        // Read all files from uploads directory
        const files = fs.readdirSync(uploadsDir);

        // Group files by product
        const products = {};

        files.forEach(file => {
            // Skip metadata.json
            if (file === 'metadata.json') return;

            const stats = fs.statSync(path.join(uploadsDir, file));
            const timestamp = stats.mtime.getTime();

            // Extract product name from filename
            // Format: productname_timestamp.txt or productname_banner_timestamp.png
            let productKey;
            let fileType;

            if (file.includes('_banner_')) {
                // Banner file
                const parts = file.split('_banner_');
                productKey = parts[0];
                fileType = 'banner';
            } else if (file.endsWith('.txt')) {
                // Description file
                const parts = file.split('_');
                parts.pop(); // Remove timestamp
                productKey = parts.join('_');
                fileType = 'description';
            } else {
                return; // Skip unknown files
            }

            // Initialize product entry if doesn't exist
            if (!products[productKey]) {
                products[productKey] = {
                    name: productKey.replace(/_/g, ' '),
                    files: {},
                    timestamp: timestamp
                };
            }

            // Add file to product
            products[productKey].files[fileType] = {
                filename: file,
                path: `/uploads/${file}`,
                timestamp: timestamp
            };

            // Update product timestamp to most recent file
            if (timestamp > products[productKey].timestamp) {
                products[productKey].timestamp = timestamp;
            }
        });

        // Convert to array and sort by most recent
        const productArray = Object.keys(products).map(key => ({
            id: key,
            ...products[key]
        })).sort((a, b) => b.timestamp - a.timestamp);

        res.json({
            success: true,
            count: productArray.length,
            products: productArray
        });

    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch history',
            message: error.message
        });
    }
});

module.exports = router;
