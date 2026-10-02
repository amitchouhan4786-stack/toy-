/**
 * WonderToys API Client & Mock REST Gateway
 * Provides simulated backend API endpoints with realistic network latency,
 * persistent mock database, webhook events, and payment authorization.
 */

(function () {
  'use strict';

  // In-memory / LocalStorage backed mock database
  const STORAGE_KEYS = {
    ORDERS: 'wonder_db_orders',
    TRANSACTIONS: 'wonder_db_transactions',
    CUSTOMERS: 'wonder_db_customers'
  };

  function getDB(key, defaultVal = []) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
    } catch (e) {
      return defaultVal;
    }
  }

  function setDB(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Failed to persist mock DB:', e);
    }
  }

  // Simulated latency helper
  const delay = (ms = 350) => new Promise(res => setTimeout(res, ms));

  // Available Payment Methods Matrix
  const PAYMENT_GATEWAYS = [
    {
      id: 'card',
      name: 'Credit / Debit Card',
      category: 'card',
      icons: ['💳', 'VISA', 'MC', 'AMEX'],
      supportedBrands: ['Visa', 'MasterCard', 'American Express', 'Discover', 'RuPay'],
      processingFee: 0,
      instant: true
    },
    {
      id: 'upi',
      name: 'UPI / QR Code',
      category: 'instant',
      icons: ['📱', 'GPay', 'PhonePe', 'Paytm'],
      supportedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred'],
      processingFee: 0,
      instant: true
    },
    {
      id: 'wallets',
      name: 'Digital Wallets & Express Pay',
      category: 'wallet',
      icons: ['🅿️', 'Apple Pay', 'Google Pay'],
      supportedWallets: ['PayPal Express', 'Apple Pay', 'Google Pay', 'Venmo'],
      processingFee: 0,
      instant: true
    },
    {
      id: 'bnpl',
      name: 'Buy Now Pay Later (BNPL)',
      category: 'installment',
      icons: ['🛍️', 'Klarna', 'Afterpay'],
      installments: 4,
      interestRate: '0%',
      instant: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking & Wire Transfer',
      category: 'bank',
      icons: ['🏦'],
      instant: true
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency (Web3 Pay)',
      category: 'crypto',
      icons: ['⚡', 'BTC', 'ETH', 'USDT'],
      supportedCoins: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT (Tether Tron/ERC20)', 'Solana (SOL)'],
      instant: true
    },
    {
      id: 'giftcard',
      name: 'Toy Gift Card / Voucher',
      category: 'voucher',
      icons: ['🎁'],
      instant: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      category: 'offline',
      icons: ['💵'],
      processingFee: 2.00,
      instant: false
    }
  ];

  class WonderToysAPI {
    constructor() {
      this.baseUrl = '/api/v1';
      this.gateways = PAYMENT_GATEWAYS;
    }

    /**
     * GET /api/v1/products
     */
    async getProducts(filter = {}) {
      await delay(200);
      let list = [...PRODUCTS_DATA];
      if (filter.category && filter.category !== 'all') {
        list = list.filter(p => p.category === filter.category);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return {
        status: 200,
        success: true,
        count: list.length,
        data: list,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * GET /api/v1/products/:id
     */
    async getProductById(id) {
      await delay(150);
      const product = PRODUCTS_DATA.find(p => p.id === id);
      if (!product) {
        return { status: 404, success: false, error: 'Product not found' };
      }
      return { status: 200, success: true, data: product };
    }

    /**
     * GET /api/v1/payment-methods
     */
    async getPaymentGateways() {
      await delay(100);
      return {
        status: 200,
        success: true,
        data: this.gateways
      };
    }

    /**
     * POST /api/v1/coupons/validate
     */
    async validateCoupon(code, amount = 0) {
      await delay(250);
      const upper = (code || '').trim().toUpperCase();
      const coupon = PROMO_CODES[upper];
      if (!coupon) {
        return {
          status: 400,
          success: false,
          error: 'Invalid or expired promo coupon code.'
        };
      }
      if (coupon.minSpend && amount < coupon.minSpend) {
        return {
          status: 400,
          success: false,
          error: `Coupon requires minimum spend of $${coupon.minSpend}.`
        };
      }
      return {
        status: 200,
        success: true,
        data: {
          code: upper,
          ...coupon
        }
      };
    }

    /**
     * POST /api/v1/payments/create-intent
     * Generates a cryptographically simulated transaction intent token.
     */
    async createPaymentIntent(paymentData) {
      await delay(350);
      const intentId = 'pi_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      const intent = {
        id: intentId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        method: paymentData.method,
        status: 'requires_confirmation',
        clientSecret: intentId + '_secret_' + Math.random().toString(36).substring(2, 8),
        createdAt: new Date().toISOString()
      };

      const transactions = getDB(STORAGE_KEYS.TRANSACTIONS);
      transactions.unshift(intent);
      setDB(STORAGE_KEYS.TRANSACTIONS, transactions);

      return {
        status: 200,
        success: true,
        data: intent
      };
    }

    /**
     * POST /api/v1/payments/confirm
     * Simulates gateway verification across Card, UPI, Wallets, BNPL, Net Banking, Crypto & COD.
     */
    async confirmPayment(intentId, methodDetails) {
      await delay(700); // realistic payment gateway roundtrip
      const transactions = getDB(STORAGE_KEYS.TRANSACTIONS);
      const txn = transactions.find(t => t.id === intentId) || {
        id: intentId,
        amount: methodDetails.amount || 0,
        currency: 'USD'
      };

      // Generate distinct Gateway Reference IDs based on payment method
      let gatewayRef = '';
      let statusDetails = '';

      switch (methodDetails.method) {
        case 'card':
          const last4 = (methodDetails.cardNumber || '4242').replace(/\s+/g, '').slice(-4);
          gatewayRef = `TXN_STRIPE_${Math.floor(10000000 + Math.random() * 90000000)}`;
          statusDetails = `Card ending in •••• ${last4} authorized via 3D-Secure 2.0`;
          break;
        case 'upi':
          gatewayRef = `UPI_REF_${Math.floor(100000000000 + Math.random() * 900000000000)}`;
          statusDetails = `Verified via NPCI UPI Gateway (${methodDetails.upiId || 'instant-qr@bank'})`;
          break;
        case 'wallets':
          gatewayRef = `PAYPAL_CAPT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          statusDetails = `Instant wallet clearance via ${methodDetails.walletType || 'Digital Wallet'}`;
          break;
        case 'bnpl':
          gatewayRef = `KLARNA_AUTH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          statusDetails = `Approved for 4 installments of $${(txn.amount / 4).toFixed(2)}`;
          break;
        case 'netbanking':
          gatewayRef = `ACH_WIRE_${Math.floor(10000000 + Math.random() * 90000000)}`;
          statusDetails = `Bank Direct Clearing (${methodDetails.bankName || 'Verified Bank'})`;
          break;
        case 'crypto':
          gatewayRef = `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
          statusDetails = `12/12 Blockchain Confirmations (${methodDetails.cryptoCoin || 'USDT'})`;
          break;
        case 'giftcard':
          gatewayRef = `GIFT_VOUCH_${Math.floor(100000 + Math.random() * 900000)}`;
          statusDetails = `Gift Voucher Balance Redeemed`;
          break;
        case 'cod':
          gatewayRef = `COD_OTP_${Math.floor(100000 + Math.random() * 900000)}`;
          statusDetails = `Cash on Delivery Verified with Dispatch OTP`;
          break;
        default:
          gatewayRef = `TXN_GEN_${Date.now()}`;
          statusDetails = `Payment cleared`;
      }

      txn.status = 'succeeded';
      txn.gatewayReference = gatewayRef;
      txn.statusDetails = statusDetails;
      txn.method = methodDetails.method;
      txn.confirmedAt = new Date().toISOString();

      setDB(STORAGE_KEYS.TRANSACTIONS, transactions);

      return {
        status: 200,
        success: true,
        data: {
          intentId: txn.id,
          status: 'succeeded',
          transactionId: gatewayRef,
          details: statusDetails,
          method: methodDetails.method,
          timestamp: txn.confirmedAt
        }
      };
    }

    /**
     * POST /api/v1/orders
     */
    async createOrder(orderPayload) {
      await delay(300);
      const orderId = 'WT-' + Math.floor(100000 + Math.random() * 900000);
      const order = {
        orderId: orderId,
        createdAt: new Date().toISOString(),
        customer: orderPayload.customer,
        shippingAddress: orderPayload.shippingAddress,
        items: orderPayload.items,
        pricing: orderPayload.pricing,
        payment: orderPayload.payment,
        fulfillmentStatus: 'processing',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
        }),
        trackingNumber: 'TRK' + Math.floor(1000000000 + Math.random() * 9000000000)
      };

      const orders = getDB(STORAGE_KEYS.ORDERS);
      orders.unshift(order);
      setDB(STORAGE_KEYS.ORDERS, orders);

      return {
        status: 201,
        success: true,
        data: order
      };
    }

    /**
     * GET /api/v1/orders/:id
     */
    async getOrder(orderId) {
      await delay(200);
      const orders = getDB(STORAGE_KEYS.ORDERS);
      const order = orders.find(o => o.orderId === orderId);
      if (!order) {
        return { status: 404, success: false, error: 'Order not found' };
      }
      return { status: 200, success: true, data: order };
    }
  }

  // Attach globally
  window.wonderAPI = new WonderToysAPI();

})();
