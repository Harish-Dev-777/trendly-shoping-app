const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, storeId } = req.query;
    
    const where = {};
    
    if (category) where.category = category;
    if (storeId) where.storeId = storeId;
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    where.inStock = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        store: {
          select: {
            name: true,
            logo: true
          }
        },
        rating: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true
          }
        },
        rating: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a product rating
router.post('/:id/rate', async (req, res) => {
  try {
    const { userId, rating, review, orderId } = req.body;
    
    // Check if rating already exists for this order+product+user
    // If orderId is not provided, we just check if they have any review for this product
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId,
        productId: req.params.id,
        ...(orderId ? { orderId } : { orderId: null })
      }
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this product' });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        productId: req.params.id,
        orderId: orderId || null,
        rating: parseInt(rating),
        review
      },
      include: {
        user: { select: { name: true, image: true } }
      }
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
