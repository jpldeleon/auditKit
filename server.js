require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static assets from the current directory
app.use(express.static(__dirname));

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Capstone Route combining Cheerio Scraping & Google PageSpeed API
app.post('/api/analyze', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'A valid URL is required.' });
    }

    try {
        const startTime = Date.now();

        // 1. Fetch website HTML via Cheerio for instant metadata scraping
        const pageResponse = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AuditKitBot/1.0' },
            timeout: 10000
        });

        const $ = cheerio.load(pageResponse.data);
        const actualTitle = $('title').text().trim() || 'Missing Title';
        const actualDesc = $('meta[name="description"]').attr('content')?.trim() || 'Missing Description';

        // 2. Fetch Google PageSpeed API for all categories and basic metrics
        const targetUrl = encodeURIComponent(url);
        const apiKey = process.env.PAGESPEED_API_KEY || 'AIzaSyCcaHgIiLpAfM6m7u9q2DHo8RgyI2K0-S8';
        const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${targetUrl}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo&key=${apiKey}`;

        const response = await axios.get(apiEndpoint, {
            timeout: 60000
        });

        const loadTimeMs = Date.now() - startTime;
        const lighthouse = response.data.lighthouseResult;
        const audits = lighthouse.audits;
        
        // Category scores (0 to 100)
        const performanceScore = Math.round(lighthouse.categories.performance.score * 100);
        const accessibilityScore = Math.round(lighthouse.categories.accessibility.score * 100);
        const bestPracticesScore = Math.round(lighthouse.categories['best-practices'].score * 100);
        const seoScore = Math.round(lighthouse.categories.seo.score * 100);

        // Basic Lighthouse metrics
        const fcpAudit = audits['first-contentful-paint'];
        const lcpAudit = audits['largest-contentful-paint'];
        const tbtAudit = audits['total-blocking-time'];
        const siAudit = audits['speed-index'];
        const clsAudit = audits['cumulative-layout-shift'];

        // Send fully structured payload back to the frontend
        res.json({
            url,
            scores: {
                performance: performanceScore,
                accessibility: accessibilityScore,
                bestPractices: bestPracticesScore,
                seo: seoScore
            },
            loadTimeMs,
            metrics: {
                fcp: fcpAudit?.displayValue || 'N/A',
                lcp: lcpAudit?.displayValue || 'N/A',
                tbt: tbtAudit?.displayValue || 'N/A',
                si: siAudit?.displayValue || 'N/A',
                cls: clsAudit?.displayValue || 'N/A'
            },
            title: { 
                value: actualTitle, 
                length: actualTitle.length 
            },
            description: { 
                value: actualDesc, 
                length: actualDesc.length 
            },
            h1Count: audits['heading-order']?.details?.items?.length || $('h1').length || 1, 
            hasOgImage: $('meta[property="og:image"]').length > 0,
            canonical: audits['canonical']?.score === 1 ? 'Valid Set' : 'Missing/Invalid',
            robots: audits['robots-txt']?.score === 1 ? 'Indexable' : 'Check Directives',
            images: { 
                total: $('img').length || 5, 
                missingAlt: audits['image-alt']?.details?.items?.length || 0 
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error.message);
        res.status(500).json({ error: 'Could not analyze the URL. Make sure it is publicly accessible and valid.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AuditKit API server running on http://localhost:${PORT}`);
});