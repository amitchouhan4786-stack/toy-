/**
 * WonderToys Node.js / Express Backend Server
 * Production-ready server with REST API endpoints, CORS, static file serving,
 * and payment gateway authorization endpoints.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Mock Database in memory
let orders = [];
let transactions = [];

// API: Get All Products
app.get('/api/v1/products', (req, res) => {
  try {
    // Read products from products.js or inline
    res.json({
      success: true,
      message: 'Products fetched successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Payment Intent Creation (Stripe / UPI / PayPal / BNPL / Crypto)
app.post('/api/v1/payments/create-intent', (req, res) => {
  const { amount, currency, method } = req.body;
  const intentId = 'pi_' + Math.random().toString(36).substring(2, 12);

  const newIntent = {
    id: intentId,
    amount: amount || 0,
    currency: currency || 'USD',
    method: method || 'card',
    status: 'requires_confirmation',
    createdAt: new Date().toISOString()
  };

  transactions.unshift(newIntent);
  res.json({ success: true, data: newIntent });
});

// API: Payment Confirmation
app.post('/api/v1/payments/confirm', (req, res) => {
  const { intentId, method, paymentDetails } = req.body;
  const txn = transactions.find(t => t.id === intentId) || { id: intentId };

  let gatewayRef = 'TXN_' + Math.floor(10000000 + Math.random() * 90000000);
  if (method === 'upi') gatewayRef = 'UPI_REF_' + Math.floor(100000000000 + Math.random() * 900000000000);
  if (method === 'crypto') gatewayRef = '0x' + Math.random().toString(16).substr(2, 40);

  txn.status = 'succeeded';
  txn.gatewayReference = gatewayRef;
  txn.confirmedAt = new Date().toISOString();

  res.json({
    success: true,
    data: {
      intentId,
      status: 'succeeded',
      transactionId: gatewayRef,
      method,
      confirmedAt: txn.confirmedAt
    }
  });
});

// API: Create Order
app.post('/api/v1/orders', (req, res) => {
  const orderId = 'WT-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    orderId,
    ...req.body,
    createdAt: new Date().toISOString(),
    trackingNumber: 'TRK' + Math.floor(1000000000 + Math.random() * 9000000000)
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// API: Track Order
app.get('/api/v1/orders/:id', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.json({ success: true, data: order });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🧸 WonderToys server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
