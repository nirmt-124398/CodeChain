const express = require('express');
const router = express.Router();
const platformSpecs = require('../platformSpecs.json');

router.post('/', (req, res) => {
    const { platform, bannerMeta, descriptionLength } = req.body;
    const issues = [];

    if (!platform || !platformSpecs.platforms[platform]) {
        return res.status(400).json({ error: 'Invalid or missing platform' });
    }

    const specs = platformSpecs.platforms[platform];

    // Validate description length
    if (descriptionLength > specs.max_description_chars) {
        issues.push(`Description length ${descriptionLength} exceeds max ${specs.max_description_chars} for ${platform}`);
    }

    // Validate banner size (assuming bannerMeta contains width and height)
    // bannerMeta format: { width: 1000, height: 500 }
    if (bannerMeta) {
        const [expectedWidth, expectedHeight] = specs.banner_size.split('x').map(Number);
        if (bannerMeta.width !== expectedWidth || bannerMeta.height !== expectedHeight) {
            // For MVP, we might just warn, or strictly enforce. Let's warn.
            issues.push(`Banner size ${bannerMeta.width}x${bannerMeta.height} does not match expected ${specs.banner_size} for ${platform}`);
        }
    }

    res.json({ issues });
});

module.exports = router;
