const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze product image with Gemini AI
router.post('/analyze-product', async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: image
        }
      },
      `You are a product listing expert. Analyze this product image and provide:
1. A concise, catchy product name (max 60 characters) that would work well for an e-commerce listing.
2. A detailed product description (2-3 sentences) that highlights key features, materials, and benefits. Make it compelling for buyers.

Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{"name": "Product Name Here", "description": "Product description here."}`
    ]);

    const response = result.response;
    const text = response.text();

    // Parse JSON from response (handle markdown code blocks)
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      res.status(200).json(parsed);
    } else {
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('Error analyzing product:', error);
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      return res.status(429).json({ error: 'AI quota exceeded. Please try again later or check your API key billing details.' });
    }
    res.status(500).json({ error: 'Failed to analyze product image' });
  }
});

module.exports = router;
