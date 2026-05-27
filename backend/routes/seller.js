const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get store info by userId
router.get('/store/:userId', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.params.userId }
    });
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.status(200).json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/Apply for a store
router.post('/store', async (req, res) => {
  try {
    const { userId, name, username, description, address, logo, email, contact } = req.body;
    
    const existingStore = await prisma.store.findUnique({
      where: { userId }
    });
    
    if (existingStore) {
      return res.status(400).json({ error: 'You already have a store application' });
    }

    // Check if username is already taken
    const existingUsername = await prisma.store.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Store username "' + username + '" is already taken. Please choose a different username.' });
    }
    
    // Ensure the user exists in our database before creating a store
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: name || 'Unknown',
        email: email || '',
        image: logo || ''
      }
    });

    const store = await prisma.store.create({
      data: {
        userId,
        name,
        username,
        description,
        address,
        logo,
        email,
        contact,
        status: 'pending',
        isActive: false
      }
    });
    
    res.status(201).json(store);
  } catch (error) {
    console.error('Error creating store:', error);
    // Catch any remaining Prisma unique constraint errors
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      return res.status(400).json({ error: 'Store username is already taken. Please choose a different username.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller products
router.get('/:storeId/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { storeId: req.params.storeId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a product
router.post('/:storeId/products', async (req, res) => {
  try {
    const { name, description, mrp, price, images, category, inStock } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        images,
        category,
        inStock: inStock !== undefined ? inStock : true,
        storeId: req.params.storeId
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product
router.put('/:storeId/products/:productId', async (req, res) => {
  try {
    const { name, description, mrp, price, images, category, inStock } = req.body;
    
    // Verify product belongs to store
    const product = await prisma.product.findFirst({
      where: { id: req.params.productId, storeId: req.params.storeId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(mrp && { mrp: parseFloat(mrp) }),
        ...(price && { price: parseFloat(price) }),
        ...(images && { images }),
        ...(category && { category }),
        ...(inStock !== undefined && { inStock })
      }
    });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
router.delete('/:storeId/products/:productId', async (req, res) => {
  try {
    // Verify product belongs to store
    const product = await prisma.product.findFirst({
      where: { id: req.params.productId, storeId: req.params.storeId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: req.params.productId }
    });
    
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller orders
router.get('/:storeId/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { storeId: req.params.storeId },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get store metrics
router.get('/:storeId/metrics', async (req, res) => {
  try {
    const products = await prisma.product.count({
      where: { storeId: req.params.storeId }
    });
    
    const orders = await prisma.order.findMany({
      where: { storeId: req.params.storeId }
    });
    
    const totalOrders = orders.length;
    const totalEarnings = orders
      .filter(order => order.status !== 'CANCELLED')
      .reduce((acc, order) => acc + order.total, 0);

    // Mock ratings for now since we don't have a ratings schema implemented fully
    const ratings = [];

    res.status(200).json({
      totalProducts: products,
      totalOrders,
      totalEarnings,
      ratings
    });
  } catch (error) {
    console.error('Error fetching store metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
