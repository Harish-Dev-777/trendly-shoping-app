const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true
              }
            }
          }
        },
        store: {
          select: {
            name: true
          }
        },
        address: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { userId, storeId, addressId, paymentMethod, total, items, isCouponUsed, coupon } = req.body;
    
    // Begin transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Check if this is the user's first order
      const previousOrdersCount = await prisma.order.count({
        where: { userId }
      });

      let finalTotal = total;
      let finalIsCouponUsed = isCouponUsed || false;
      let finalCoupon = coupon || {};

      if (previousOrdersCount === 0) {
        // Apply 20% discount for first order
        finalTotal = total * 0.8;
        finalIsCouponUsed = true;
        finalCoupon = {
          code: 'FIRST20',
          description: '20% off on your first order',
          discount: 20
        };
      }

      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          paymentMethod,
          total: finalTotal,
          isCouponUsed: finalIsCouponUsed,
          coupon: finalCoupon,
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          orderItems: true
        }
      });
      
      // Clear user cart or update if needed
      await prisma.user.update({
        where: { id: userId },
        data: { cart: {} } // Assuming we clear cart after order
      });
      
      return newOrder;
    });
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedOrder = await prisma.order.update({
      where: { id: req.params.orderId },
      data: { status }
    });
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
