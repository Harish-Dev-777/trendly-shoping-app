const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sync user from Clerk Webhook (simplified version)
router.post('/sync', async (req, res) => {
  try {
    const { id, first_name, last_name, email_addresses, image_url } = req.body.data;
    
    // In a real app, you should verify the webhook signature here
    
    const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '';
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    
    const user = await prisma.user.upsert({
      where: { id: id },
      update: {
        name,
        email,
        image: image_url || ''
      },
      create: {
        id,
        name,
        email,
        image: image_url || '',
        cart: {}
      }
    });
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        Address: true,
        store: true,
        ratings: true
      }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: req.params.id,
          name: 'Trendly User',
          email: '',
          image: '',
          cart: {},
          wishlist: []
        },
        include: {
          Address: true,
          store: true,
          ratings: true
        }
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync cart and wishlist
router.put('/:id/sync-data', async (req, res) => {
  try {
    const { cart, wishlist, name, image } = req.body;
    
    const updateData = {};
    if (cart !== undefined) updateData.cart = cart;
    if (wishlist !== undefined) updateData.wishlist = wishlist;
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    const user = await prisma.user.upsert({
      where: { id: req.params.id },
      update: updateData,
      create: {
        id: req.params.id,
        name: name || 'Trendly User',
        email: '',
        image: image || '',
        cart: cart || {},
        wishlist: wishlist || []
      }
    });
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user data:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get user addresses
router.get('/:id/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.params.id }
    });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Add new address
router.post('/:id/address', async (req, res) => {
  try {
    const { name, email, street, city, state, zip, country, phone } = req.body;
    const address = await prisma.address.create({
      data: {
        userId: req.params.id,
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone
      }
    });
    res.status(201).json(address);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available coupons for a user
router.get('/:id/coupons', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user has any existing orders (to determine "new user")
    const orderCount = await prisma.order.count({ where: { userId } });
    const isNewUser = orderCount === 0;

    // Fetch all non-expired coupons
    const allCoupons = await prisma.coupon.findMany({
      where: {
        expiresAt: { gt: new Date() }
      }
    });

    // Filter coupons: show public coupons, new-user coupons if new, and member coupons
    const eligible = allCoupons.filter(coupon => {
      if (coupon.isPublic) return true;
      if (coupon.forNewUser && isNewUser) return true;
      if (coupon.forMember) return true; // member check can be refined later
      return false;
    });

    res.status(200).json(eligible);
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Validate a specific coupon code for a user
router.post('/:id/validate-coupon', async (req, res) => {
  try {
    const userId = req.params.id;
    const { code } = req.body;

    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
    if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon has expired' });

    const orderCount = await prisma.order.count({ where: { userId } });
    const isNewUser = orderCount === 0;

    if (coupon.forNewUser && !isNewUser) {
      return res.status(400).json({ error: 'This coupon is only for new users' });
    }

    res.status(200).json(coupon);
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
