const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path'); // Standard Node package

const app = express();

app.use(cors());
app.use(express.json());

// Serve static assets from the current directory
app.use(express.static(__dirname));

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  try {
    const startTime = Date.now();

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO Audit Bot' },
      timeout: 10000
    });

    const loadTimeMs = Date.now() - startTime;
    const $ = cheerio.load(response.data);

    const title = $('title').text().trim() || 'Missing';
    const metaDescription = $('meta[name="description"]').attr('content') || 'Missing';
    const h1Count = $('h1').length;
    const ogImage = $('meta[property="og:image"]').attr('content') || null;
    const canonical = $('link[rel="canonical"]').attr('href') || 'Missing';
    const robots = $('meta[name="robots"]').attr('content') || 'Not specified';

    const totalImages = $('img').length;
    let missingAltCount = 0;
    $('img').each((_, img) => {
      const alt = $(img).attr('alt');
      if (!alt || alt.trim() === '') missingAltCount++;
    });

    let score = 100;
    if (title === 'Missing' || title.length < 30 || title.length > 60) score -= 15;
    if (metaDescription === 'Missing' || metaDescription.length < 120) score -= 15;
    if (h1Count !== 1) score -= 15;
    if (!ogImage) score -= 15;
    if (canonical === 'Missing') score -= 15;
    if (missingAltCount > 0) score -= 15;
    if (loadTimeMs > 2000) score -= 10;

    res.json({
      url,
      score: Math.max(0, score),
      loadTimeMs,
      title: { value: title, length: title === 'Missing' ? 0 : title.length },
      description: { value: metaDescription, length: metaDescription === 'Missing' ? 0 : metaDescription.length },
      h1Count,
      hasOgImage: !!ogImage,
      canonical,
      robots,
      images: { total: totalImages, missingAlt: missingAltCount }
    });

  } catch (error) {
    res.status(500).json({ error: 'Could not fetch or parse the specified URL.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 auditKit running on http://localhost:${PORT}`);
});