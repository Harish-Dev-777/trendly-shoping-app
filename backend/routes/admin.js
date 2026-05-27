const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all stores (pending and active)
router.get('/stores', async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update store status (approve/reject)
router.put('/stores/:id/status', async (req, res) => {
  try {
    const { status, isActive } = req.body;
    
    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: {
        status,
        isActive
      }
    });
    
    res.status(200).json(store);
  } catch (error) {
    console.error('Error updating store status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all coupons
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create coupon
router.post('/coupons', async (req, res) => {
  try {
    const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = req.body;
    
    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discount: parseFloat(discount),
        forNewUser,
        forMember: forMember || false,
        isPublic,
        expiresAt: new Date(expiresAt)
      }
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin metrics
router.get('/metrics', async (req, res) => {
  try {
    const products = await prisma.product.count();
    const stores = await prisma.store.count();
    
    const orders = await prisma.order.findMany();
    const totalOrders = orders.length;
    
    const revenue = orders
      .filter(order => order.status !== 'CANCELLED')
      .reduce((acc, order) => acc + order.total, 0);

    res.status(200).json({
      products,
      stores,
      orders: totalOrders,
      revenue,
      allOrders: orders // Used for Area chart
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
