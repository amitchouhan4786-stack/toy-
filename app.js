/**
 * WonderToys - Main Application Logic
 * Full E-Commerce Functionality with Persistent Cart, Wishlist,
 * 8-Gateway Money Transaction Processing, REST API Client,
 * Quick View, Gift Quiz, and Deployment Assistant.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    products: PRODUCTS_DATA,
    filteredProducts: [...PRODUCTS_DATA],
    cart: JSON.parse(localStorage.getItem('wonder_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('wonder_wishlist') || '[]'),
    activeCategory: 'all',
    ageFilter: 'all',
    maxPrice: 120,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
    searchQuery: '',
    appliedCoupon: null,
    soundEnabled: localStorage.getItem('wonder_sound') !== 'false',
    selectedPaymentMethod: 'card',
    checkoutCustomer: {
      firstName: 'Alex',
      lastName: 'Taylor',
      email: 'alex.taylor@example.com',
      street: '123 Sunny Boulevard',
      city: 'San Francisco',
      zip: '94103'
    }
  };

  // Web Audio Sound FX Synthesizer
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'add') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
          noteGain.gain.setValueAtTime(0.15, now + idx * 0.1);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
          noteOsc.start(now + idx * 0.1);
          noteOsc.stop(now + idx * 0.1 + 0.25);
        });
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // DOM Elements Cache
  const DOM = {
    productsGrid: document.getElementById('productsGrid'),
    productsCount: document.getElementById('productsCount'),
    categoryPills: document.querySelectorAll('.category-pill'),
    sortSelect: document.getElementById('sortSelect'),
    priceRange: document.getElementById('priceRange'),
    priceDisplay: document.getElementById('priceDisplay'),
    stockCheckbox: document.getElementById('stockOnlyCheck'),
    saleCheckbox: document.getElementById('saleOnlyCheck'),
    ageRadios: document.querySelectorAll('input[name="ageFilter"]'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    // Search
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    searchDropdown: document.getElementById('searchDropdown'),
    // Cart Drawer
    cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartCloseBtn: document.getElementById('cartCloseBtn'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartNavBtn: document.getElementById('cartNavBtn'),
    cartBadgeCount: document.getElementById('cartBadgeCount'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartShipping: document.getElementById('cartShipping'),
    cartDiscountRow: document.getElementById('cartDiscountRow'),
    cartDiscountAmount: document.getElementById('cartDiscountAmount'),
    cartTax: document.getElementById('cartTax'),
    cartTotal: document.getElementById('cartTotal'),
    couponInput: document.getElementById('couponInput'),
    applyCouponBtn: document.getElementById('applyCouponBtn'),
    couponMsg: document.getElementById('couponMsg'),
    freeShippingText: document.getElementById('freeShippingText'),
    freeShippingFill: document.getElementById('freeShippingFill'),
    checkoutBtnDrawer: document.getElementById('checkoutBtnDrawer'),
    // Wishlist Drawer
    wishlistNavBtn: document.getElementById('wishlistNavBtn'),
    wishlistBadgeCount: document.getElementById('wishlistBadgeCount'),
    wishlistDrawer: document.getElementById('wishlistDrawer'),
    wishlistCloseBtn: document.getElementById('wishlistCloseBtn'),
    wishlistItemsList: document.getElementById('wishlistItemsList'),
    // Modals
    quickviewModal: document.getElementById('quickviewModal'),
    quickviewContent: document.getElementById('quickviewContent'),
    checkoutModal: document.getElementById('checkoutModal'),
    giftWizardModal: document.getElementById('giftWizardModal'),
    apiModal: document.getElementById('apiModal'),
    deployModal: document.getElementById('deployModal'),
    // Sound & Top Tool Buttons
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Toast Notification System
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Save State Helpers
  function saveCart() {
    localStorage.setItem('wonder_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('wonder_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
  }

  // Filter & Sort Logic
  function applyFilters() {
    let list = [...state.products];

    if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category === state.activeCategory);
    }
    if (state.ageFilter !== 'all') {
      list = list.filter(p => p.ageGroup === state.ageFilter);
    }
    list = list.filter(p => p.price <= state.maxPrice);
    if (state.inStockOnly) {
      list = list.filter(p => p.inStock);
    }
    if (state.onSaleOnly) {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    switch (state.sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
    }

    state.filteredProducts = list;
    renderProducts();
  }

  // Render Product Cards
  function renderProducts() {
    DOM.productsCount.textContent = state.filteredProducts.length;

    if (state.filteredProducts.length === 0) {
      DOM.productsGrid.innerHTML = `
        <div class="empty-results-box">
          <div class="empty-icon">🧸🔍</div>
          <h3>No toys match your filters</h3>
          <p>Try clearing some filters or searching for something else like "robot", "train", or "plush".</p>
          <button class="btn-primary" id="resetEmptyBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('resetEmptyBtn')?.addEventListener('click', resetAllFilters);
      return;
    }

    DOM.productsGrid.innerHTML = state.filteredProducts.map(p => {
      const isWishlisted = state.wishlist.includes(p.id);
      const badgeHtml = p.badge
        ? `<span class="card-badge ${p.badgeType || 'bestseller'}">${p.badge}</span>`
        : '';
      const originalPriceHtml = p.originalPrice
        ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>`
        : '';

      return `
        <div class="product-card" data-id="${p.id}">
          <div class="card-img-container" onclick="window.wonderApp.openQuickView('${p.id}')">
            ${badgeHtml}
            <button class="wishlist-btn-card ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
                    onclick="event.stopPropagation(); window.wonderApp.toggleWishlist('${p.id}')">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>
            <img src="${p.images[0]}" alt="${p.name}" class="card-img" loading="lazy" />
            <button class="quick-view-btn-card" onclick="event.stopPropagation(); window.wonderApp.openQuickView('${p.id}')">
              👁️ Quick View
            </button>
          </div>
          <div class="card-body">
            <div class="card-meta-row">
              <span class="card-category">${p.categoryLabel}</span>
              <span class="card-age-pill">Age ${p.age}</span>
            </div>
            <h3 class="card-title" onclick="window.wonderApp.openQuickView('${p.id}')">${p.name}</h3>
            <div class="card-rating-row">
              <span class="stars-gold">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
              <span class="rating-count">(${p.reviewCount})</span>
            </div>
            <div class="card-footer">
              <div class="price-box">
                <span class="price-current">$${p.price.toFixed(2)}</span>
                ${originalPriceHtml}
              </div>
              <button class="add-cart-btn-card" title="Add to Cart" onclick="window.wonderApp.addToCart('${p.id}', 1)">
                🛒+
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Add / Manage Cart
  function addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        categoryLabel: product.categoryLabel,
        quantity: quantity
      });
    }

    saveCart();
    playSound('add');
    showToast(`Added <strong>${product.name}</strong> to your bag!`, '🛒');

    DOM.cartBadgeCount.classList.add('bounce');
    setTimeout(() => DOM.cartBadgeCount.classList.remove('bounce'), 300);
  }

  function updateCartQuantity(productId, delta) {
    const index = state.cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    playSound('click');
  }

  function removeCartItem(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    playSound('click');
    showToast('Item removed from cart', '🗑️');
  }

  function calculateCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (state.appliedCoupon) {
      if (state.appliedCoupon.discountPercent) {
        discount = subtotal * (state.appliedCoupon.discountPercent / 100);
      } else if (state.appliedCoupon.discountAmount) {
        if (!state.appliedCoupon.minSpend || subtotal >= state.appliedCoupon.minSpend) {
          discount = state.appliedCoupon.discountAmount;
        }
      }
    }

    const shippingThreshold = 50;
    let shipping = subtotal > 0 && subtotal < shippingThreshold ? 5.99 : 0;
    if (state.appliedCoupon && state.appliedCoupon.freeShipping) {
      shipping = 0;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.05;
    const total = taxableAmount + shipping + tax;

    return { subtotal, discount, shipping, tax, total };
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    DOM.cartBadgeCount.textContent = totalCount;

    if (state.cart.length === 0) {
      DOM.cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🛒</div>
          <h4 style="color: var(--text-main); font-weight: 700; margin-bottom: 6px;">Your cart is empty</h4>
          <p style="font-size: 0.85rem; margin-bottom: 16px;">Looks like you haven't picked any toys yet.</p>
          <button class="btn-primary" onclick="window.wonderApp.closeDrawers()">Start Shopping</button>
        </div>
      `;
      DOM.checkoutBtnDrawer.disabled = true;
      DOM.checkoutBtnDrawer.style.opacity = '0.6';
    } else {
      DOM.checkoutBtnDrawer.disabled = false;
      DOM.checkoutBtnDrawer.style.opacity = '1';
      DOM.cartItemsList.innerHTML = state.cart.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="qty-control-group">
              <button class="qty-btn" onclick="window.wonderApp.updateCartQuantity('${item.id}', -1)">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="window.wonderApp.updateCartQuantity('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove-btn" title="Remove" onclick="window.wonderApp.removeCartItem('${item.id}')">✕</button>
        </div>
      `).join('');
    }

    const { subtotal, discount, shipping, tax, total } = calculateCartTotals();

    const shippingThreshold = 50;
    if (subtotal >= shippingThreshold || (state.appliedCoupon && state.appliedCoupon.freeShipping)) {
      DOM.freeShippingText.innerHTML = `<span>🎉 You unlocked <strong>FREE Standard Shipping!</strong></span>`;
      DOM.freeShippingFill.style.width = '100%';
    } else if (subtotal > 0) {
      const remaining = (shippingThreshold - subtotal).toFixed(2);
      const percent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
      DOM.freeShippingText.innerHTML = `<span>Add <strong>$${remaining}</strong> more for <strong>FREE Shipping</strong></span><span>${percent}%</span>`;
      DOM.freeShippingFill.style.width = `${percent}%`;
    } else {
      DOM.freeShippingText.innerHTML = `<span>Free shipping on all orders over $50</span>`;
      DOM.freeShippingFill.style.width = '0%';
    }

    DOM.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    DOM.cartShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    DOM.cartTax.textContent = `$${tax.toFixed(2)}`;
    DOM.cartTotal.textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
      DOM.cartDiscountRow.style.display = 'flex';
      DOM.cartDiscountAmount.textContent = `-$${discount.toFixed(2)}`;
    } else {
      DOM.cartDiscountRow.style.display = 'none';
    }
  }

  // Wishlist Handling
  function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`Removed from Wishlist`, '💔');
    } else {
      state.wishlist.push(productId);
      showToast(`Saved <strong>${product.name}</strong> to Wishlist!`, '💖');
    }

    playSound('click');
    saveWishlist();
    renderProducts();
  }

  function updateWishlistUI() {
    DOM.wishlistBadgeCount.textContent = state.wishlist.length;
    const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
      DOM.wishlistItemsList.innerHTML = `
        <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 12px;">💖</div>
          <h4 style="color: var(--text-main); font-weight: 700; margin-bottom: 6px;">Your wishlist is empty</h4>
          <p style="font-size: 0.85rem; margin-bottom: 16px;">Heart any toy to save it for later or gift ideas!</p>
          <button class="btn-primary" onclick="window.wonderApp.closeDrawers()">Explore Toys</button>
        </div>
      `;
    } else {
      DOM.wishlistItemsList.innerHTML = wishlistProducts.map(item => `
        <div class="cart-item-row">
          <img src="${item.images[0]}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <button class="btn-primary" style="padding: 6px 14px; font-size: 0.78rem; margin-top: 6px;" 
                    onclick="window.wonderApp.addToCart('${item.id}', 1); window.wonderApp.toggleWishlist('${item.id}')">
              Move to Cart 🛒
            </button>
          </div>
          <button class="cart-item-remove-btn" title="Remove" onclick="window.wonderApp.toggleWishlist('${item.id}')">✕</button>
        </div>
      `).join('');
    }
  }

  // Drawers Controls
  function openCart() {
    DOM.cartDrawerBackdrop.classList.add('active');
    DOM.cartDrawer.classList.add('active');
    DOM.wishlistDrawer.classList.remove('active');
    playSound('click');
  }

  function openWishlist() {
    DOM.cartDrawerBackdrop.classList.add('active');
    DOM.wishlistDrawer.classList.add('active');
    DOM.cartDrawer.classList.remove('active');
    playSound('click');
  }

  function closeDrawers() {
    DOM.cartDrawerBackdrop.classList.remove('active');
    DOM.cartDrawer.classList.remove('active');
    DOM.wishlistDrawer.classList.remove('active');
  }

  // Quick View Modal
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const specsHtml = Object.entries(product.specs || {}).map(([key, val]) => `
      <tr>
        <td>${key}</td>
        <td>${val}</td>
      </tr>
    `).join('');

    const reviewsHtml = (product.reviews || []).map(r => `
      <div style="margin-bottom: 12px; padding: 10px; background: #f8fafc; border-radius: 8px; font-size: 0.82rem;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
          <span>${r.author}</span>
          <span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.8rem;">${r.comment}</p>
      </div>
    `).join('');

    DOM.quickviewContent.innerHTML = `
      <div class="quickview-layout">
        <div class="quickview-gallery">
          <img src="${product.images[0]}" alt="${product.name}" class="gallery-main-img" id="quickMainImg" />
          <div class="gallery-thumbs">
            ${product.images.map((img, i) => `
              <img src="${img}" alt="Thumb" class="gallery-thumb-item ${i === 0 ? 'active' : ''}" 
                   onclick="document.getElementById('quickMainImg').src='${img}'; document.querySelectorAll('.gallery-thumb-item').forEach(el=>el.classList.remove('active')); this.classList.add('active');" />
            `).join('')}
          </div>
        </div>
        <div class="quickview-details">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="card-category">${product.categoryLabel}</span>
            <span class="card-age-pill">Age ${product.age}</span>
            ${product.badge ? `<span class="card-badge ${product.badgeType || 'bestseller'}" style="position: static;">${product.badge}</span>` : ''}
          </div>
          <h2 class="quickview-title">${product.name}</h2>
          <div class="card-rating-row">
            <span class="stars-gold">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style="font-weight: 700; font-size: 0.85rem;">${product.rating.toFixed(1)}</span>
            <span class="rating-count">(${product.reviewCount} customer reviews)</span>
          </div>
          <div class="price-box" style="margin: 4px 0;">
            <span class="price-current" style="font-size: 1.7rem;">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="price-original" style="font-size: 1rem;">Regular: $${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">${product.description}</p>
          
          <table class="quickview-specs-table">
            <tbody>${specsHtml}</tbody>
          </table>

          <div style="display: flex; gap: 12px; margin-top: 10px; align-items: center;">
            <div class="qty-control-group" style="padding: 6px 10px;">
              <button class="qty-btn" id="modalQtyMinus">-</button>
              <span class="qty-number" id="modalQtyVal" style="font-size: 1rem; min-width: 32px;">1</span>
              <button class="qty-btn" id="modalQtyPlus">+</button>
            </div>
            <button class="btn-primary" style="flex: 1; padding: 12px 20px; justify-content: center;" id="modalAddCartBtn">
              Add to Shopping Bag 🛒
            </button>
            <button class="nav-btn-icon-only" id="modalWishlistBtn" title="Wishlist">
              ${state.wishlist.includes(product.id) ? '❤️' : '🤍'}
            </button>
          </div>

          <div style="margin-top: 16px;">
            <h4 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 8px;">Parent & Verified Buyer Reviews:</h4>
            ${reviewsHtml}
          </div>
        </div>
      </div>
    `;

    let modalQty = 1;
    const qtyMinus = document.getElementById('modalQtyMinus');
    const qtyPlus = document.getElementById('modalQtyPlus');
    const qtyVal = document.getElementById('modalQtyVal');
    const addBtn = document.getElementById('modalAddCartBtn');
    const wishBtn = document.getElementById('modalWishlistBtn');

    qtyMinus.addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        qtyVal.textContent = modalQty;
        playSound('click');
      }
    });

    qtyPlus.addEventListener('click', () => {
      modalQty++;
      qtyVal.textContent = modalQty;
      playSound('click');
    });

    addBtn.addEventListener('click', () => {
      addToCart(product.id, modalQty);
      closeQuickView();
      openCart();
    });

    wishBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
      wishBtn.innerHTML = state.wishlist.includes(product.id) ? '❤️' : '🤍';
    });

    DOM.quickviewModal.classList.add('active');
    playSound('click');
  }

  function closeQuickView() {
    DOM.quickviewModal.classList.remove('active');
  }

  // ==========================================================================
  // ALL WAYS OF MONEY TRANSACTIONS - CHECKOUT ENGINE
  // ==========================================================================

  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('Your cart is empty! Add toys first.', '⚠️');
      return;
    }
    closeDrawers();
    renderCheckoutStep(1);
    DOM.checkoutModal.classList.add('active');
    playSound('click');
  }

  function closeCheckout() {
    DOM.checkoutModal.classList.remove('active');
  }

  function renderCheckoutStep(step) {
    const { total } = calculateCartTotals();
    let bodyHtml = '';

    if (step === 1) {
      bodyHtml = `
        <div style="padding: 28px 32px;">
          <div class="checkout-steps-bar">
            <div class="step-item active"><div class="step-circle">1</div>Shipping</div>
            <div class="step-item"><div class="step-circle">2</div>Payment Ways</div>
            <div class="step-item"><div class="step-circle">3</div>Receipt</div>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.45rem; margin-bottom: 6px;">1. Shipping Information</h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 18px;">Where should we deliver the happy bundle?</p>
          
          <form id="shippingForm" onsubmit="event.preventDefault(); window.wonderApp.submitShippingStep()">
            <div class="form-grid-2">
              <div class="form-control-wrap">
                <label class="form-label">First Name *</label>
                <input type="text" id="shipFirstName" class="form-input" required value="${state.checkoutCustomer.firstName}" />
              </div>
              <div class="form-control-wrap">
                <label class="form-label">Last Name *</label>
                <input type="text" id="shipLastName" class="form-input" required value="${state.checkoutCustomer.lastName}" />
              </div>
            </div>
            <div class="form-control-wrap">
              <label class="form-label">Email Address (for order tracking & API receipt) *</label>
              <input type="email" id="shipEmail" class="form-input" required value="${state.checkoutCustomer.email}" />
            </div>
            <div class="form-control-wrap">
              <label class="form-label">Street Address *</label>
              <input type="text" id="shipStreet" class="form-input" required value="${state.checkoutCustomer.street}" />
            </div>
            <div class="form-grid-2">
              <div class="form-control-wrap">
                <label class="form-label">City *</label>
                <input type="text" id="shipCity" class="form-input" required value="${state.checkoutCustomer.city}" />
              </div>
              <div class="form-control-wrap">
                <label class="form-label">Postal / ZIP Code *</label>
                <input type="text" id="shipZip" class="form-input" required value="${state.checkoutCustomer.zip}" />
              </div>
            </div>
            
            <div style="background: #f8fafc; border-radius: var(--radius-md); padding: 12px 16px; margin: 16px 0; font-size: 0.85rem; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                <span>Total Amount Due:</span>
                <span style="color: var(--primary); font-size: 1.1rem; font-weight: 800;">$${total.toFixed(2)}</span>
              </div>
              <span style="font-size: 0.78rem; color: var(--accent-emerald); font-weight: 600;">✨ All 8 payment methods & instant encryption ready</span>
            </div>

            <button type="submit" class="btn-checkout" style="margin-top: 10px;">
              Continue to Choose Payment Method →
            </button>
          </form>
        </div>
      `;
    } else if (step === 2) {
      const pMethod = state.selectedPaymentMethod;

      bodyHtml = `
        <div style="padding: 28px 32px;">
          <div class="checkout-steps-bar">
            <div class="step-item completed"><div class="step-circle">✓</div>Shipping</div>
            <div class="step-item active"><div class="step-circle">2</div>Payment Ways</div>
            <div class="step-item"><div class="step-circle">3</div>Receipt</div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
            <h3 style="font-family: var(--font-heading); font-size: 1.45rem;">2. All Ways of Money Transaction</h3>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-emerald);">🔒 256-bit SSL Gateway</span>
          </div>
          <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 16px;">Select any of the 8 global payment methods below:</p>
          
          <!-- 8 Payment Gateways Selector Grid -->
          <div class="payment-grid-selector">
            <div class="gateway-option-card ${pMethod === 'card' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('card')">
              <span class="gateway-icon">💳</span>
              <span class="gateway-label">Credit / Debit Card</span>
              <span class="gateway-badge">Instant</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'upi' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('upi')">
              <span class="gateway-icon">📱</span>
              <span class="gateway-label">UPI / QR Code</span>
              <span class="gateway-badge">Zero Fee</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'wallets' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('wallets')">
              <span class="gateway-icon">🅿️</span>
              <span class="gateway-label">Apple / Google / PayPal</span>
              <span class="gateway-badge">1-Click</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'bnpl' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('bnpl')">
              <span class="gateway-icon">🛍️</span>
              <span class="gateway-label">Pay in 4 (Klarna / Afterpay)</span>
              <span class="gateway-badge">0% APR</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'netbanking' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('netbanking')">
              <span class="gateway-icon">🏦</span>
              <span class="gateway-label">Net Banking / Wire</span>
              <span class="gateway-badge">All Banks</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'crypto' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('crypto')">
              <span class="gateway-icon">⚡</span>
              <span class="gateway-label">Web3 Crypto (BTC/ETH/USDT)</span>
              <span class="gateway-badge">Fast</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'giftcard' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('giftcard')">
              <span class="gateway-icon">🎁</span>
              <span class="gateway-label">Toy Gift Card / Voucher</span>
              <span class="gateway-badge">Redeem</span>
            </div>
            <div class="gateway-option-card ${pMethod === 'cod' ? 'active' : ''}" onclick="window.wonderApp.selectPaymentMethod('cod')">
              <span class="gateway-icon">💵</span>
              <span class="gateway-label">Cash on Delivery (COD)</span>
              <span class="gateway-badge">Doorstep</span>
            </div>
          </div>

          <!-- Dynamic Gateway Form Content -->
          <div id="activeGatewayForm">
            ${renderPaymentMethodFields(pMethod, total)}
          </div>
        </div>
      `;
    }

    DOM.checkoutModal.querySelector('.modal-card').innerHTML = `
      <button class="modal-close-btn" onclick="window.wonderApp.closeCheckout()">✕</button>
      ${bodyHtml}
    `;
  }

  function submitShippingStep() {
    state.checkoutCustomer = {
      firstName: document.getElementById('shipFirstName').value,
      lastName: document.getElementById('shipLastName').value,
      email: document.getElementById('shipEmail').value,
      street: document.getElementById('shipStreet').value,
      city: document.getElementById('shipCity').value,
      zip: document.getElementById('shipZip').value
    };
    playSound('click');
    renderCheckoutStep(2);
  }

  function selectPaymentMethod(methodId) {
    state.selectedPaymentMethod = methodId;
    playSound('click');
    renderCheckoutStep(2);
  }

  function renderPaymentMethodFields(method, total) {
    switch (method) {
      case 'card':
        return `
          <div class="interactive-card-preview">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div class="card-preview-chip"></div>
              <span style="font-weight: 800; font-size: 1.1rem; letter-spacing: 1px;" id="cardBrandLogo">VISA</span>
            </div>
            <div class="card-preview-number" id="previewCardNum">•••• •••• •••• 8892</div>
            <div class="card-preview-meta">
              <div>
                <span style="font-size: 0.65rem; color: #a5b4fc;">Cardholder</span>
                <div class="card-preview-name" id="previewCardName">${state.checkoutCustomer.firstName} ${state.checkoutCustomer.lastName}</div>
              </div>
              <div>
                <span style="font-size: 0.65rem; color: #a5b4fc;">Expires</span>
                <div style="font-weight: 700; font-family: monospace;" id="previewCardExp">08/28</div>
              </div>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); window.wonderApp.processOrderPayment('card')">
            <div class="form-control-wrap">
              <label class="form-label">Name on Card *</label>
              <input type="text" class="form-input" required id="cardHolderInput" 
                     value="${state.checkoutCustomer.firstName} ${state.checkoutCustomer.lastName}"
                     oninput="document.getElementById('previewCardName').textContent = this.value || 'Cardholder';" />
            </div>
            <div class="form-control-wrap">
              <label class="form-label">Card Number (Visa, MC, Amex, RuPay, Discover) *</label>
              <input type="text" class="form-input" required id="cardNumberInput" maxlength="19" 
                     value="4532 8921 7743 8892" 
                     oninput="window.wonderApp.formatCardInput(this);" />
            </div>
            <div class="form-grid-2">
              <div class="form-control-wrap">
                <label class="form-label">Expiry Date (MM/YY) *</label>
                <input type="text" class="form-input" required id="cardExpiryInput" maxlength="5" value="08/28"
                       oninput="document.getElementById('previewCardExp').textContent = this.value || 'MM/YY';" />
              </div>
              <div class="form-control-wrap">
                <label class="form-label">CVV / Security Code *</label>
                <input type="password" class="form-input" required id="cardCvvInput" maxlength="4" value="542" />
              </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 14px;">
              <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
              <button type="submit" class="btn-checkout" style="flex: 2;">Pay $${total.toFixed(2)} with Card 💳</button>
            </div>
          </form>
        `;

      case 'upi':
        return `
          <div class="qr-payment-box">
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">Scan & Pay via any UPI App</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Instant zero-fee transaction with real-time clearance</p>
            
            <div class="qr-code-graphic">
              <!-- Inline High-Quality Vector QR Code -->
              <svg width="150" height="150" viewBox="0 0 100 100" fill="#0f172a">
                <rect x="0" y="0" width="30" height="30" fill="#0f172a" rx="4"/>
                <rect x="6" y="6" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="10" y="10" width="10" height="10" fill="#0f172a"/>
                <rect x="70" y="0" width="30" height="30" fill="#0f172a" rx="4"/>
                <rect x="76" y="6" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="80" y="10" width="10" height="10" fill="#0f172a"/>
                <rect x="0" y="70" width="30" height="30" fill="#0f172a" rx="4"/>
                <rect x="6" y="76" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="10" y="80" width="10" height="10" fill="#0f172a"/>
                <rect x="42" y="12" width="16" height="16" fill="#4f46e5"/>
                <rect x="42" y="42" width="16" height="16" fill="#0f172a"/>
                <rect x="68" y="42" width="20" height="10" fill="#0f172a"/>
                <rect x="42" y="70" width="12" height="20" fill="#0f172a"/>
                <rect x="68" y="70" width="22" height="20" fill="#4f46e5"/>
              </svg>
            </div>

            <div class="qr-apps-badge-row">
              <span class="qr-app-pill">Google Pay</span>
              <span class="qr-app-pill">PhonePe</span>
              <span class="qr-app-pill">Paytm</span>
              <span class="qr-app-pill">BHIM UPI</span>
              <span class="qr-app-pill">Cred</span>
            </div>

            <div style="background: #ffffff; border: 1px dashed #cbd5e1; border-radius: var(--radius-sm); padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.85rem;">
              <span>VPA: <strong>wondertoys@okaxis</strong></span>
              <button class="top-tool-btn" style="background: #e2e8f0; color: #0f172a; padding: 2px 8px; font-size: 0.72rem;" onclick="navigator.clipboard?.writeText('wondertoys@okaxis'); window.wonderApp.showToast('UPI ID Copied!', '📋');">Copy</button>
            </div>

            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
              Amount: <strong style="color: var(--primary); font-size: 1rem;">$${total.toFixed(2)}</strong>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
              <button type="button" class="btn-checkout" style="flex: 2;" onclick="window.wonderApp.processOrderPayment('upi')">
                Simulate UPI App Approval 🚀
              </button>
            </div>
          </div>
        `;

      case 'wallets':
        return `
          <div style="padding: 10px 0;">
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 18px;">Click your preferred wallet for seamless express checkout with saved delivery address:</p>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              <button class="btn-secondary" style="background: #000; color: #fff; padding: 14px; font-size: 1rem; border-radius: var(--radius-md); justify-content: center;" onclick="window.wonderApp.processOrderPayment('wallets', { walletType: 'Apple Pay' })">
                Pay with <span style="font-weight: 800; margin-left: 4px;"> Apple Pay</span>
              </button>
              <button class="btn-secondary" style="background: #ffffff; border: 2px solid #e2e8f0; padding: 14px; font-size: 1rem; border-radius: var(--radius-md); justify-content: center;" onclick="window.wonderApp.processOrderPayment('wallets', { walletType: 'Google Pay' })">
                <span style="font-weight: 800;">G Pay</span> Express Checkout
              </button>
              <button class="btn-secondary" style="background: #ffc439; color: #003087; font-weight: 800; border: none; padding: 14px; font-size: 1.05rem; border-radius: var(--radius-md); justify-content: center;" onclick="window.wonderApp.processOrderPayment('wallets', { walletType: 'PayPal' })">
                <span style="font-style: italic;">PayPal</span> Checkout
              </button>
            </div>

            <div style="text-align: center;">
              <button type="button" class="btn-secondary" onclick="window.wonderApp.renderCheckoutStep(1)">← Back to Shipping</button>
            </div>
          </div>
        `;

      case 'bnpl':
        const installmentAmount = (total / 4).toFixed(2);
        return `
          <div class="bnpl-timeline-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: #9f1239;">Klarna / Afterpay - 4 Interest-Free Payments</h4>
              <span style="background: #ffe4e6; color: #e11d48; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: var(--radius-full);">0% APR</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Split your $${total.toFixed(2)} purchase into 4 equal bi-weekly payments with no hidden fees.</p>
            
            <div class="bnpl-steps-row">
              <div class="bnpl-step-item">
                <div class="bnpl-step-amount">$${installmentAmount}</div>
                <div class="bnpl-step-date">Due Today</div>
              </div>
              <div class="bnpl-step-item">
                <div class="bnpl-step-amount">$${installmentAmount}</div>
                <div class="bnpl-step-date">In 2 Weeks</div>
              </div>
              <div class="bnpl-step-item">
                <div class="bnpl-step-amount">$${installmentAmount}</div>
                <div class="bnpl-step-date">In 4 Weeks</div>
              </div>
              <div class="bnpl-step-item">
                <div class="bnpl-step-amount">$${installmentAmount}</div>
                <div class="bnpl-step-date">In 6 Weeks</div>
              </div>
            </div>
          </div>

          <form onsubmit="event.preventDefault(); window.wonderApp.processOrderPayment('bnpl')">
            <div class="form-control-wrap">
              <label class="form-label">Mobile Phone Number (for instant SMS agreement code) *</label>
              <input type="tel" class="form-input" required placeholder="+1 (555) 019-2834" value="+1 (555) 234-5678" />
            </div>
            <div class="form-control-wrap">
              <label class="form-label">Date of Birth (soft identity verification only) *</label>
              <input type="date" class="form-input" required value="1992-06-15" />
            </div>

            <div style="display: flex; gap: 10px; margin-top: 14px;">
              <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
              <button type="submit" class="btn-checkout" style="flex: 2;">Confirm 4x $${installmentAmount} Payments 🛍️</button>
            </div>
          </form>
        `;

      case 'netbanking':
        return `
          <div style="padding: 10px 0;">
            <div class="form-control-wrap">
              <label class="form-label">Select Your Banking Institution *</label>
              <select class="form-input" id="bankSelect">
                <option value="chase">JPMorgan Chase Bank</option>
                <option value="bofa">Bank of America</option>
                <option value="wells">Wells Fargo</option>
                <option value="citi">Citibank N.A.</option>
                <option value="hdfc">HDFC Bank NetBanking</option>
                <option value="sbi">State Bank of India (SBI)</option>
                <option value="barclays">Barclays Direct UK</option>
                <option value="hsbc">HSBC Global Banking</option>
              </select>
            </div>

            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin: 16px 0; font-size: 0.82rem;">
              <div style="font-weight: 700; margin-bottom: 4px;">Instant Direct Clearing:</div>
              <p style="color: var(--text-muted);">You will be securely redirected to your bank's encrypted online portal to authorize $${total.toFixed(2)} with your two-factor credentials.</p>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
              <button type="button" class="btn-checkout" style="flex: 2;" onclick="window.wonderApp.processOrderPayment('netbanking', { bankName: document.getElementById('bankSelect').options[document.getElementById('bankSelect').selectedIndex].text })">
                Proceed to Secure Bank Portal 🏦
              </button>
            </div>
          </div>
        `;

      case 'crypto':
        const cryptoUSDT = total.toFixed(2);
        const cryptoBTC = (total / 65000).toFixed(6);
        return `
          <div class="qr-payment-box">
            <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 4px;">Web3 Cryptocurrency Checkout</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Instant multi-chain settlement (Zero chargebacks)</p>
            
            <div class="form-control-wrap" style="text-align: left; max-width: 320px; margin: 0 auto 12px;">
              <label class="form-label">Choose Cryptocurrency Asset:</label>
              <select class="form-input" id="cryptoAssetSelect" onchange="window.wonderApp.updateCryptoPreview(this.value, ${total})">
                <option value="USDT">USDT (Tether TRC20 / ERC20) - ~$${cryptoUSDT}</option>
                <option value="BTC">Bitcoin (BTC) - ~${cryptoBTC} BTC</option>
                <option value="ETH">Ethereum (ETH) - ~${(total / 3500).toFixed(5)} ETH</option>
                <option value="SOL">Solana (SOL) - ~${(total / 150).toFixed(4)} SOL</option>
              </select>
            </div>

            <div class="qr-code-graphic" style="width: 140px; height: 140px;">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="#4f46e5">
                <rect x="0" y="0" width="30" height="30" rx="4"/>
                <rect x="6" y="6" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="10" y="10" width="10" height="10"/>
                <rect x="70" y="0" width="30" height="30" rx="4"/>
                <rect x="76" y="6" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="80" y="10" width="10" height="10"/>
                <rect x="0" y="70" width="30" height="30" rx="4"/>
                <rect x="6" y="76" width="18" height="18" fill="#ffffff" rx="2"/>
                <rect x="10" y="80" width="10" height="10"/>
                <circle cx="50" cy="50" r="14" fill="#0f172a"/>
              </svg>
            </div>

            <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: var(--radius-sm); padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.8rem; font-family: monospace;">
              <span>0x71C...B829</span>
              <button class="top-tool-btn" style="background: #e2e8f0; color: #0f172a; padding: 2px 8px; font-size: 0.72rem;" onclick="navigator.clipboard?.writeText('0x71C8A942F8356193d25B446c63E32bA417FDB829'); window.wonderApp.showToast('Deposit Address Copied!', '📋');">Copy</button>
            </div>

            <div style="display: flex; gap: 10px;">
              <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
              <button type="button" class="btn-checkout" style="flex: 2;" onclick="window.wonderApp.processOrderPayment('crypto', { cryptoCoin: document.getElementById('cryptoAssetSelect').value })">
                I Have Sent Crypto ⚡ (Verify)
              </button>
            </div>
          </div>
        `;

      case 'giftcard':
        return `
          <div style="padding: 10px 0;">
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px; border: 1px solid #fde68a;">
              <h4 style="color: #b45309; font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">WonderToys Gift Card or Store Voucher</h4>
              <p style="font-size: 0.8rem; color: #78350f;">Enter your 16-digit gift card code and 4-digit security PIN.</p>
            </div>

            <form onsubmit="event.preventDefault(); window.wonderApp.processOrderPayment('giftcard')">
              <div class="form-control-wrap">
                <label class="form-label">Gift Card Number *</label>
                <input type="text" class="form-input" required placeholder="WT-XXXX-XXXX-XXXX" value="WT-8821-4920-7712" />
              </div>
              <div class="form-control-wrap">
                <label class="form-label">4-Digit Security PIN *</label>
                <input type="password" class="form-input" required maxlength="4" placeholder="••••" value="8421" />
              </div>

              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.88rem; margin: 12px 0;">
                <span>Available Balance:</span>
                <span style="color: var(--accent-emerald);">$150.00</span>
              </div>

              <div style="display: flex; gap: 10px; margin-top: 14px;">
                <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
                <button type="submit" class="btn-checkout" style="flex: 2;">Apply & Pay $${total.toFixed(2)} 🎁</button>
              </div>
            </form>
          </div>
        `;

      case 'cod':
        return `
          <div style="padding: 10px 0;">
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
              <h4 style="color: #166534; font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">Cash on Delivery (COD)</h4>
              <p style="font-size: 0.82rem; color: #15803d;">Pay comfortably with cash or card upon doorstep arrival.</p>
            </div>

            <form onsubmit="event.preventDefault(); window.wonderApp.processOrderPayment('cod')">
              <div class="form-control-wrap">
                <label class="form-label">Recipient Mobile Phone (for Delivery OTP verification) *</label>
                <input type="tel" class="form-input" required placeholder="+1 (555) 000-0000" value="+1 (555) 789-0123" />
              </div>

              <div style="display: flex; gap: 10px; margin-top: 18px;">
                <button type="button" class="btn-secondary" style="flex: 1;" onclick="window.wonderApp.renderCheckoutStep(1)">← Back</button>
                <button type="submit" class="btn-checkout" style="flex: 2;">Confirm Cash on Delivery Order 💵</button>
              </div>
            </form>
          </div>
        `;

      default:
        return '';
    }
  }

  function formatCardInput(input) {
    let val = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    input.value = formatted;
    document.getElementById('previewCardNum').textContent = formatted || '•••• •••• •••• 8892';

    // Auto-detect brand
    const logoEl = document.getElementById('cardBrandLogo');
    if (val.startsWith('4')) logoEl.textContent = 'VISA';
    else if (val.startsWith('5')) logoEl.textContent = 'MASTERCARD';
    else if (val.startsWith('3')) logoEl.textContent = 'AMEX';
    else if (val.startsWith('6')) logoEl.textContent = 'RUPAY';
    else logoEl.textContent = 'CARD';
  }

  // Gateway Simulation & Order Finalization
  async function processOrderPayment(method, extraDetails = {}) {
    const { subtotal, discount, shipping, tax, total } = calculateCartTotals();

    // Show processing overlay
    DOM.checkoutModal.querySelector('.modal-card').innerHTML = `
      <div class="payment-processing-overlay">
        <div class="payment-spinner"></div>
        <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">Processing Transaction...</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 12px;" id="gatewayStatusText">
          Connecting to secure payment gateway (${method.toUpperCase()})...
        </p>
        <span style="font-size: 0.78rem; color: var(--accent-emerald); font-weight: 700;">🔒 End-to-End 256-bit Encrypted</span>
      </div>
    `;

    playSound('click');

    // Create payment intent via WonderAPI
    const intentRes = await window.wonderAPI.createPaymentIntent({
      amount: total,
      method: method
    });

    // Update status
    const statusTextEl = document.getElementById('gatewayStatusText');
    if (statusTextEl) statusTextEl.textContent = 'Authorizing transaction with network...';

    // Confirm payment via WonderAPI
    const confirmRes = await window.wonderAPI.confirmPayment(intentRes.data.id, {
      method: method,
      amount: total,
      ...extraDetails
    });

    if (statusTextEl) statusTextEl.textContent = 'Creating order & booking delivery...';

    // Finalize order via WonderAPI
    const orderPayload = {
      customer: state.checkoutCustomer,
      shippingAddress: {
        street: state.checkoutCustomer.street,
        city: state.checkoutCustomer.city,
        zip: state.checkoutCustomer.zip
      },
      items: state.cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      pricing: { subtotal, discount, shipping, tax, total },
      payment: {
        method: method,
        intentId: intentRes.data.id,
        transactionId: confirmRes.data.transactionId,
        details: confirmRes.data.details,
        paidAt: confirmRes.data.timestamp
      }
    };

    const orderRes = await window.wonderAPI.createOrder(orderPayload);
    const order = orderRes.data;

    // Clear cart
    const purchasedItems = [...state.cart];
    state.cart = [];
    state.appliedCoupon = null;
    saveCart();

    playSound('success');
    triggerConfetti();

    // Render Order Success Screen
    DOM.checkoutModal.querySelector('.modal-card').innerHTML = `
      <button class="modal-close-btn" onclick="window.wonderApp.closeCheckout()">✕</button>
      <div class="success-screen-box">
        <div class="success-icon-badge">🎉</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 6px;">Payment Successful & Order Confirmed!</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Your toys are being hand-packed with magic & care.</p>
        
        <div class="order-id-badge">Order ID: #${order.orderId}</div>
        
        <div style="max-width: 480px; margin: 0 auto 20px; text-align: left; background: #f8fafc; border-radius: var(--radius-md); padding: 18px; font-size: 0.85rem; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color);">
            <span style="font-weight: 700; color: var(--text-main);">Payment Method:</span>
            <span style="font-weight: 800; color: var(--primary); text-transform: uppercase;">${order.payment.method}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Gateway Ref / Txn ID:</span>
            <span style="font-family: monospace; font-weight: 700;">${order.payment.transactionId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-muted);">Estimated Delivery:</span>
            <span style="color: var(--accent-emerald); font-weight: 800;">${order.estimatedDelivery}</span>
          </div>

          <h4 style="font-weight: 700; margin: 12px 0 6px;">Package Contents:</h4>
          ${purchasedItems.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.82rem;">
              <span>${item.quantity}x ${item.name}</span>
              <span style="font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}

          <div style="border-top: 1px dashed #cbd5e1; margin-top: 10px; padding-top: 8px; display: flex; justify-content: space-between; font-weight: 800; font-size: 1rem;">
            <span>Total Paid:</span>
            <span style="color: var(--primary);">$${order.pricing.total.toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="window.wonderApp.closeCheckout()">Continue Exploring Toys 🧸</button>
          <button class="btn-secondary" onclick="window.print()">🖨️ Print Receipt</button>
          <button class="btn-secondary" onclick="window.wonderApp.openApiExplorer()">View API Payload 🛠️</button>
        </div>
      </div>
    `;
  }

  // Interactive Gift Wizard (Toy Match Quiz)
  const wizardAnswers = { recipient: '', age: '', interest: '' };

  function openGiftWizard() {
    wizardAnswers.recipient = '';
    wizardAnswers.age = '';
    wizardAnswers.interest = '';
    renderWizardStep(1);
    DOM.giftWizardModal.classList.add('active');
    playSound('click');
  }

  function closeGiftWizard() {
    DOM.giftWizardModal.classList.remove('active');
  }

  function renderWizardStep(step) {
    let content = '';
    if (step === 1) {
      content = `
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px;">Step 1: Who are you shopping for?</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">We'll curate recommendations suited to their style.</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('recipient', 'boy', 2)">
            <div class="gateway-icon">👦</div>
            <div class="gateway-label" style="font-size: 0.95rem;">A Boy</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('recipient', 'girl', 2)">
            <div class="gateway-icon">👧</div>
            <div class="gateway-label" style="font-size: 0.95rem;">A Girl</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('recipient', 'any', 2)">
            <div class="gateway-icon">🌟</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Any Little Star</div>
          </button>
        </div>
      `;
    } else if (step === 2) {
      content = `
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px;">Step 2: What's their age group?</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">Safety and developmentally-appropriate learning.</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('age', '0-2', 3)">
            <div class="gateway-icon">👶</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Baby & Toddler (0-2 Yrs)</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('age', '3-5', 3)">
            <div class="gateway-icon">🧒</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Preschooler (3-5 Yrs)</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('age', '6-8', 3)">
            <div class="gateway-icon">🎒</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Explorer Kid (6-8 Yrs)</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('age', '9+', 3)">
            <div class="gateway-icon">🚀</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Big Kid & Tween (9+ Yrs)</div>
          </button>
        </div>
      `;
    } else if (step === 3) {
      content = `
        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px;">Step 3: What do they enjoy most?</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px;">Pick their main passion.</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('interest', 'building', 4)">
            <div class="gateway-icon">🧱</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Building & STEM</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('interest', 'action', 4)">
            <div class="gateway-icon">🏎️</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Action, RC & Speed</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('interest', 'cuddles', 4)">
            <div class="gateway-icon">🧸</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Plush & Comfort</div>
          </button>
          <button class="gateway-option-card" onclick="window.wonderApp.recordWizard('interest', 'creativity', 4)">
            <div class="gateway-icon">🎨</div>
            <div class="gateway-label" style="font-size: 0.95rem;">Arts, Crafts & Games</div>
          </button>
        </div>
      `;
    } else if (step === 4) {
      let matches = state.products.filter(p => {
        if (wizardAnswers.age && p.ageGroup !== wizardAnswers.age) return false;
        return true;
      });

      if (matches.length === 0) {
        matches = state.products.slice(0, 3);
      } else {
        matches = matches.slice(0, 3);
      }

      playSound('success');

      content = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 2.2rem;">🎁✨</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.6rem; margin-top: 6px;">We Found the Perfect Matches!</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Hand-picked for your chosen preferences:</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          ${matches.map(m => `
            <div style="display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
              <img src="${m.images[0]}" alt="${m.name}" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;" />
              <div style="flex: 1;">
                <h4 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 4px;">${m.name}</h4>
                <div style="font-weight: 800; color: var(--primary);">$${m.price.toFixed(2)}</div>
              </div>
              <button class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;" onclick="window.wonderApp.addToCart('${m.id}', 1); window.wonderApp.closeGiftWizard();">
                Add to Cart 🛒
              </button>
            </div>
          `).join('')}
        </div>

        <div style="text-align: center;">
          <button class="btn-secondary" onclick="window.wonderApp.openGiftWizard()">Start Over 🔄</button>
        </div>
      `;
    }

    DOM.giftWizardModal.querySelector('.modal-card').innerHTML = `
      <button class="modal-close-btn" onclick="window.wonderApp.closeGiftWizard()">✕</button>
      <div style="padding: 32px;">${content}</div>
    `;
  }

  function recordWizard(key, val, nextStep) {
    wizardAnswers[key] = val;
    playSound('click');
    renderWizardStep(nextStep);
  }

  // ==========================================================================
  // DEVELOPER API EXPLORER MODAL
  // ==========================================================================

  function openApiExplorer() {
    renderApiExplorer();
    DOM.apiModal.classList.add('active');
    playSound('click');
  }

  function closeApiExplorer() {
    DOM.apiModal.classList.remove('active');
  }

  async function renderApiExplorer() {
    const productsRes = await window.wonderAPI.getProducts();
    const gatewaysRes = await window.wonderAPI.getPaymentGateways();

    DOM.apiModal.querySelector('.modal-card').innerHTML = `
      <button class="modal-close-btn" onclick="window.wonderApp.closeApiExplorer()">✕</button>
      <div style="padding: 32px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
          <span style="font-size: 1.8rem;">🛠️</span>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem;">WonderToys Developer REST API</h3>
            <p style="font-size: 0.84rem; color: var(--text-muted);">Inspect live JSON responses, test mock endpoints, and integrate external clients.</p>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <!-- Endpoint 1: Products -->
          <div class="api-endpoint-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="api-method-badge api-method-get">GET</span>
                <span>/api/v1/products</span>
              </div>
              <button class="top-tool-btn" onclick="window.wonderApp.testApiCall('products')">Send Request</button>
            </div>
            <pre class="api-json-pre" id="apiOutputProducts">${JSON.stringify(productsRes, null, 2)}</pre>
          </div>

          <!-- Endpoint 2: Payment Gateways -->
          <div class="api-endpoint-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="api-method-badge api-method-get">GET</span>
                <span>/api/v1/payment-methods</span>
              </div>
              <button class="top-tool-btn" onclick="window.wonderApp.testApiCall('gateways')">Send Request</button>
            </div>
            <pre class="api-json-pre" id="apiOutputGateways">${JSON.stringify(gatewaysRes, null, 2)}</pre>
          </div>

          <!-- Endpoint 3: Create Payment Intent -->
          <div class="api-endpoint-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="api-method-badge api-method-post">POST</span>
                <span>/api/v1/payments/create-intent</span>
              </div>
              <button class="top-tool-btn" onclick="window.wonderApp.testApiCall('intent')">Send Test POST</button>
            </div>
            <pre class="api-json-pre" id="apiOutputIntent">// Click "Send Test POST" to simulate gateway payment intent creation</pre>
          </div>
        </div>
      </div>
    `;
  }

  async function testApiCall(type) {
    playSound('click');
    if (type === 'products') {
      const res = await window.wonderAPI.getProducts();
      document.getElementById('apiOutputProducts').textContent = JSON.stringify(res, null, 2);
      showToast('GET /api/v1/products 200 OK', '✅');
    } else if (type === 'gateways') {
      const res = await window.wonderAPI.getPaymentGateways();
      document.getElementById('apiOutputGateways').textContent = JSON.stringify(res, null, 2);
      showToast('GET /api/v1/payment-methods 200 OK', '✅');
    } else if (type === 'intent') {
      const res = await window.wonderAPI.createPaymentIntent({
        amount: 49.99,
        currency: 'USD',
        method: 'upi'
      });
      document.getElementById('apiOutputIntent').textContent = JSON.stringify(res, null, 2);
      showToast('POST /api/v1/payments/create-intent 200 OK', '⚡');
    }
  }

  // ==========================================================================
  // DEPLOY STORE ASSISTANT MODAL
  // ==========================================================================

  function openDeployModal() {
    DOM.deployModal.querySelector('.modal-card').innerHTML = `
      <button class="modal-close-btn" onclick="window.wonderApp.closeDeployModal()">✕</button>
      <div style="padding: 32px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
          <span style="font-size: 1.8rem;">🚀</span>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem;">Deploy WonderToys Live</h3>
            <p style="font-size: 0.84rem; color: var(--text-muted);">Choose your preferred hosting provider for instant free global deployment.</p>
          </div>
        </div>

        <div style="margin: 24px 0;">
          <!-- Option 1: Vercel -->
          <div class="deploy-option-card">
            <div class="deploy-logo-box">▲</div>
            <div style="flex: 1;">
              <h4 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 2px;">Deploy to Vercel (1-Click Edge Hosting)</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
                Configuration pre-packaged in <code>vercel.json</code>. Free SSL & Global CDN.
              </p>
              <div style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; display: inline-block;">
                npx vercel deploy
              </div>
            </div>
            <button class="btn-primary" style="padding: 8px 16px; font-size: 0.84rem;" onclick="window.open('https://vercel.com/new', '_blank')">
              Deploy Vercel ↗
            </button>
          </div>

          <!-- Option 2: Netlify -->
          <div class="deploy-option-card">
            <div class="deploy-logo-box">🌐</div>
            <div style="flex: 1;">
              <h4 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 2px;">Deploy to Netlify (Drag & Drop or Git)</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
                Configuration pre-packaged in <code>netlify.toml</code>. Drag the folder directly into Netlify Drop.
              </p>
              <div style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; display: inline-block;">
                netlify deploy --prod
              </div>
            </div>
            <button class="btn-primary" style="padding: 8px 16px; font-size: 0.84rem; background: #00ad9f;" onclick="window.open('https://app.netlify.com/drop', '_blank')">
              Netlify Drop ↗
            </button>
          </div>

          <!-- Option 3: GitHub Pages -->
          <div class="deploy-option-card">
            <div class="deploy-logo-box">🐙</div>
            <div style="flex: 1;">
              <h4 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 2px;">GitHub Pages (Automated CI/CD Workflow)</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted);">
                Workflow ready in <code>.github/workflows/deploy.yml</code>. Push to GitHub and your site is live!
              </p>
            </div>
            <button class="btn-secondary" style="padding: 8px 16px; font-size: 0.84rem;" onclick="window.open('https://github.com/new', '_blank')">
              GitHub Repo ↗
            </button>
          </div>

          <!-- Option 4: Local / Self-Hosted Node.js Server -->
          <div class="deploy-option-card">
            <div class="deploy-logo-box">💻</div>
            <div style="flex: 1;">
              <h4 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 2px;">Self-Hosted Node / Express Server</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
                Run production server locally or on any VPS (AWS, DigitalOcean, Render, Railway).
              </p>
              <div style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; display: inline-block;">
                node server.js
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    DOM.deployModal.classList.add('active');
    playSound('click');
  }

  function closeDeployModal() {
    DOM.deployModal.classList.remove('active');
  }

  // Confetti Particle System
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    const colors = ['#4f46e5', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#ec4899'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.rSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 120) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(animate);
  }

  // Coupon Application
  function applyCoupon() {
    const code = DOM.couponInput.value.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      state.appliedCoupon = PROMO_CODES[code];
      DOM.couponMsg.textContent = `Applied: ${PROMO_CODES[code].description}`;
      DOM.couponMsg.style.color = 'var(--accent-emerald)';
      DOM.couponMsg.style.display = 'block';
      playSound('add');
      showToast(`Promo Code "${code}" Applied!`, '🎉');
      updateCartUI();
    } else {
      DOM.couponMsg.textContent = 'Invalid promo code. Try "MAGIC20" or "FREESHIP"!';
      DOM.couponMsg.style.color = 'var(--accent-pink)';
      DOM.couponMsg.style.display = 'block';
      playSound('click');
    }
  }

  // Reset Filters Helper
  function resetAllFilters() {
    state.activeCategory = 'all';
    state.ageFilter = 'all';
    state.maxPrice = 120;
    state.inStockOnly = false;
    state.onSaleOnly = false;
    state.sortBy = 'featured';
    state.searchQuery = '';

    DOM.categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === 'all');
    });

    DOM.priceRange.value = 120;
    DOM.priceDisplay.textContent = '$120';
    DOM.stockCheckbox.checked = false;
    DOM.saleCheckbox.checked = false;
    DOM.sortSelect.value = 'featured';
    DOM.searchInput.value = '';
    DOM.searchClear.classList.remove('active');

    const defaultAgeRadio = document.querySelector('input[name="ageFilter"][value="all"]');
    if (defaultAgeRadio) defaultAgeRadio.checked = true;

    applyFilters();
    playSound('click');
    showToast('Filters cleared', '🧹');
  }

  // Autocomplete Live Search
  function handleSearchInput(e) {
    const val = e.target.value;
    state.searchQuery = val;
    DOM.searchClear.classList.toggle('active', val.length > 0);

    if (val.trim().length > 0) {
      const q = val.toLowerCase().trim();
      const matches = state.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      ).slice(0, 5);

      if (matches.length > 0) {
        DOM.searchDropdown.innerHTML = matches.map(m => `
          <div class="search-result-item" onclick="window.wonderApp.openQuickView('${m.id}'); document.getElementById('searchDropdown').classList.remove('active');">
            <img src="${m.images[0]}" alt="${m.name}" class="search-result-img" />
            <div>
              <div class="search-result-title">${m.name}</div>
              <div class="search-result-price">$${m.price.toFixed(2)}</div>
            </div>
          </div>
        `).join('');
        DOM.searchDropdown.classList.add('active');
      } else {
        DOM.searchDropdown.innerHTML = `
          <div style="padding: 14px 16px; font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            No toys matching "${val}"
          </div>
        `;
        DOM.searchDropdown.classList.add('active');
      }
    } else {
      DOM.searchDropdown.classList.remove('active');
    }

    applyFilters();
  }

  // Event Listeners Initialization
  function initEvents() {
    DOM.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.dataset.category;
        applyFilters();
        playSound('click');
      });
    });

    DOM.priceRange.addEventListener('input', e => {
      state.maxPrice = Number(e.target.value);
      DOM.priceDisplay.textContent = `$${state.maxPrice}`;
      applyFilters();
    });

    DOM.stockCheckbox.addEventListener('change', e => {
      state.inStockOnly = e.target.checked;
      applyFilters();
    });

    DOM.saleCheckbox.addEventListener('change', e => {
      state.onSaleOnly = e.target.checked;
      applyFilters();
    });

    DOM.ageRadios.forEach(radio => {
      radio.addEventListener('change', e => {
        state.ageFilter = e.target.value;
        applyFilters();
      });
    });

    DOM.resetFiltersBtn?.addEventListener('click', resetAllFilters);

    DOM.sortSelect.addEventListener('change', e => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    DOM.searchInput.addEventListener('input', handleSearchInput);
    DOM.searchClear.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.searchClear.classList.remove('active');
      DOM.searchDropdown.classList.remove('active');
      state.searchQuery = '';
      applyFilters();
    });

    document.addEventListener('click', e => {
      if (!DOM.searchInput.contains(e.target) && !DOM.searchDropdown.contains(e.target)) {
        DOM.searchDropdown.classList.remove('active');
      }
    });

    DOM.cartNavBtn.addEventListener('click', openCart);
    DOM.cartCloseBtn.addEventListener('click', closeDrawers);
    DOM.cartDrawerBackdrop.addEventListener('click', closeDrawers);
    DOM.checkoutBtnDrawer.addEventListener('click', openCheckout);

    DOM.wishlistNavBtn.addEventListener('click', openWishlist);
    DOM.wishlistCloseBtn.addEventListener('click', closeDrawers);

    DOM.applyCouponBtn.addEventListener('click', applyCoupon);
    DOM.couponInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') applyCoupon();
    });

    DOM.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('wonder_sound', state.soundEnabled);
      DOM.soundToggleBtn.innerHTML = state.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      showToast(state.soundEnabled ? 'Sound effects enabled' : 'Sound effects muted', state.soundEnabled ? '🔊' : '🔇');
    });

    [DOM.quickviewModal, DOM.checkoutModal, DOM.giftWizardModal, DOM.apiModal, DOM.deployModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', e => {
          if (e.target === modal) modal.classList.remove('active');
        });
      }
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeDrawers();
        closeQuickView();
        closeCheckout();
        closeGiftWizard();
        closeApiExplorer();
        closeDeployModal();
      }
    });
  }

  // Global Public API
  window.wonderApp = {
    addToCart,
    updateCartQuantity,
    removeCartItem,
    toggleWishlist,
    openQuickView,
    closeQuickView,
    openCart,
    openWishlist,
    closeDrawers,
    openCheckout,
    closeCheckout,
    renderCheckoutStep,
    submitShippingStep,
    selectPaymentMethod,
    formatCardInput,
    processOrderPayment,
    openGiftWizard,
    closeGiftWizard,
    recordWizard,
    openApiExplorer,
    closeApiExplorer,
    testApiCall,
    openDeployModal,
    closeDeployModal,
    showToast
  };

  function init() {
    updateCartUI();
    updateWishlistUI();
    applyFilters();
    initEvents();

    if (!state.soundEnabled) {
      DOM.soundToggleBtn.innerHTML = '🔇 Sound: OFF';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
