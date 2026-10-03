/**
 * D'House Jewels - THE CLASS - Checkout Page Logic
 * Retrieves configured jewelry piece from localStorage, handles quantity,
 * promo codes, delivery/payment choices, and order completion modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Default fallback product if user visits checkout directly
  const defaultProduct = {
    title: 'Luster Bracelet',
    metal: 'Silver',
    purity: '92.5%',
    color: 'White',
    diamond: 'Moissanite',
    size: '3 mm',
    certificate: 'HRD',
    certificateName: 'HRD Antwerp',
    price: 270,
    image: 'images/circle_silver.jpg',
    quantity: 1
  };

  // 1. Retrieve cart/product configuration from localStorage
  let cartItem = defaultProduct;
  try {
    const saved = localStorage.getItem('dhouse_checkout_item');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.price && parsed.price > 15000) {
        parsed.price = 270;
      }
      cartItem = { ...defaultProduct, ...parsed };
    }
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }

  // 2. DOM Elements
  const summaryImg = document.getElementById('summaryImg');
  const summaryTitle = document.getElementById('summaryTitle');
  const specTagMetal = document.getElementById('specTagMetal');
  const specTagBraceletSize = document.getElementById('specTagBraceletSize');
  const specTagDiamond = document.getElementById('specTagDiamond');
  const specTagSize = document.getElementById('specTagSize');
  const specTagColor = document.getElementById('specTagColor');
  const specTagCert = document.getElementById('specTagCert');
  const itemQty = document.getElementById('itemQty');
  const badgeQty = document.getElementById('badgeQty');
  const itemPrice = document.getElementById('itemPrice');
  const subtotalPrice = document.getElementById('subtotalPrice');
  const discountRow = document.getElementById('discountRow');
  const discountAmount = document.getElementById('discountAmount');
  const totalPrice = document.getElementById('totalPrice');
  const mobileTogglePrice = document.getElementById('mobileTogglePrice');
  const submitBtnText = document.getElementById('submitBtnText');

  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');

  const mobileSummaryToggle = document.getElementById('mobileSummaryToggle');
  const orderSummarySidebar = document.getElementById('orderSummarySidebar');

  const checkoutForm = document.getElementById('checkoutForm');
  const successModalOverlay = document.getElementById('successModalOverlay');
  const modalOrderNo = document.getElementById('modalOrderNo');
  const modalItemDesc = document.getElementById('modalItemDesc');
  const modalTotal = document.getElementById('modalTotal');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

  function formatINR(number) {
    return '$' + Math.max(0, Math.round(number)).toLocaleString('en-US');
  }

  // 3. Render Item & Calculation
  function renderCheckoutSummary() {
    if (summaryImg) summaryImg.src = cartItem.image;
    if (summaryTitle) summaryTitle.textContent = cartItem.title;
    if (specTagMetal) specTagMetal.textContent = `${cartItem.metal} (${cartItem.purity})`;
    if (specTagBraceletSize && cartItem.braceletSize) specTagBraceletSize.textContent = `Length: ${cartItem.braceletSize}`;
    if (specTagDiamond) specTagDiamond.textContent = cartItem.diamond;
    if (specTagSize) specTagSize.textContent = `Size: ${cartItem.size}`;
    if (specTagColor) specTagColor.textContent = cartItem.color;
    if (specTagCert) specTagCert.textContent = `Cert: ${cartItem.certificate}`;

    if (itemQty) itemQty.textContent = cartItem.quantity;
    if (badgeQty) badgeQty.textContent = cartItem.quantity;

    const baseLineTotal = cartItem.price * cartItem.quantity;
    if (itemPrice) itemPrice.textContent = formatINR(baseLineTotal);
    if (subtotalPrice) subtotalPrice.textContent = formatINR(baseLineTotal);

    if (totalPrice) totalPrice.textContent = formatINR(baseLineTotal);
    if (mobileTogglePrice) mobileTogglePrice.textContent = formatINR(baseLineTotal);
    if (submitBtnText) submitBtnText.textContent = `Complete Order • ${formatINR(baseLineTotal)}`;
  }

  // Initial render
  renderCheckoutSummary();

  // 4. Quantity Adjusters
  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
        saveCartState();
        renderCheckoutSummary();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      if (cartItem.quantity < 10) {
        cartItem.quantity++;
        saveCartState();
        renderCheckoutSummary();
      }
    });
  }

  function saveCartState() {
    try {
      localStorage.setItem('dhouse_checkout_item', JSON.stringify(cartItem));
    } catch (e) {
      console.warn(e);
    }
  }

  // 6. Mobile Order Summary Accordion
  if (mobileSummaryToggle && orderSummarySidebar) {
    mobileSummaryToggle.addEventListener('click', () => {
      mobileSummaryToggle.classList.toggle('open');
      orderSummarySidebar.classList.toggle('mobile-open');
    });
  }

  // 7. Payment Radio Selection Interaction
  const paymentCards = document.querySelectorAll('.payment-card');
  paymentCards.forEach((card) => {
    card.addEventListener('click', () => {
      paymentCards.forEach((c) => {
        c.classList.remove('active');
        const r = c.querySelector('input[type="radio"]');
        if (r) r.checked = false;
      });
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      // Toggle conditional fields if needed
      const method = card.getAttribute('data-method');
      const codNotice = document.getElementById('codNotice');
      const cardFields = document.getElementById('cardFields');
      if (codNotice) codNotice.style.display = method === 'cod' ? 'block' : 'none';
      if (cardFields) cardFields.style.display = method === 'online' ? 'block' : 'none';
    });
  });

  // 8. Form Submission / Place Order
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic field values
      const firstName = document.getElementById('firstName')?.value || 'Valued';
      const lastName = document.getElementById('lastName')?.value || 'Client';
      const emailOrPhone = document.getElementById('contactInput')?.value || '';
      const address = document.getElementById('addressInput')?.value || '';
      const city = document.getElementById('cityInput')?.value || '';
      const state = document.getElementById('stateInput')?.value || '';
      const pincode = document.getElementById('pincodeInput')?.value || '';

      // Generate Order ID & Save Order to localStorage (visible in /admin)
      const randomOrderNo = '#DH-' + Math.floor(10000 + Math.random() * 90000);
      const calculatedTotal = totalPrice ? totalPrice.textContent : formatINR(cartItem.price);
      const chosenPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'online';

      const newOrder = {
        orderId: randomOrderNo,
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        customer: {
          firstName,
          lastName,
          emailOrPhone,
          address,
          apartment: document.getElementById('apartmentInput')?.value || '',
          city,
          state,
          pincode,
          phone: document.getElementById('phoneInput')?.value || emailOrPhone
        },
        item: {
          title: cartItem.title,
          metal: cartItem.metal,
          purity: cartItem.purity,
          color: cartItem.color,
          diamond: cartItem.diamond,
          size: cartItem.size,
          certificate: cartItem.certificate,
          image: cartItem.image,
          price: cartItem.price,
          quantity: cartItem.quantity
        },
        total: calculatedTotal,
        paymentMethod: chosenPayment,
        status: 'Confirmed'
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem('dhouse_orders') || '[]');
        existingOrders.unshift(newOrder);
        localStorage.setItem('dhouse_orders', JSON.stringify(existingOrders));
      } catch (err) {
        console.warn('Could not save order to dhouse_orders', err);
      }

      if (modalOrderNo) modalOrderNo.textContent = randomOrderNo;
      if (modalItemDesc) {
        modalItemDesc.textContent = `${cartItem.title} (${cartItem.metal} ${cartItem.purity}, ${cartItem.diamond}, ${cartItem.size}) x ${cartItem.quantity}`;
      }
      if (modalTotal) modalTotal.textContent = calculatedTotal;

      // Handle Razorpay Payment Link if configured in Admin Panel
      const savedRazorpayLink = localStorage.getItem('dhouse_razorpay_link') || '';
      const modalRazorpayBtn = document.getElementById('modalRazorpayBtn');
      if (modalRazorpayBtn) {
        if (chosenPayment === 'online' && savedRazorpayLink) {
          modalRazorpayBtn.href = savedRazorpayLink;
          modalRazorpayBtn.style.display = 'inline-flex';
        } else {
          modalRazorpayBtn.style.display = 'none';
        }
      }

      // Helper to get WhatsApp number configured in admin
      function getWhatsAppNumber() {
        const saved = localStorage.getItem('dhouse_whatsapp_number');
        if (saved && saved.trim()) {
          const cleaned = saved.trim().replace(/[^0-9]/g, '');
          if (cleaned) return cleaned;
        }
        return '919898948986';
      }

      // Configure WhatsApp order confirmation button
      if (modalWhatsAppBtn) {
        const waText = encodeURIComponent(
          `Hello D'House Jewels! I just placed Order ${randomOrderNo} for ${cartItem.title}:\n- Configuration: ${cartItem.metal} (${cartItem.purity}) | Length: ${cartItem.braceletSize || '7” (17.8 cm)'} | ${cartItem.color} | ${cartItem.diamond} | ${cartItem.size}\n- Quantity: ${cartItem.quantity}\n- Total: ${calculatedTotal}\n- Ship To: ${firstName} ${lastName}, ${address}, ${city}, ${state} - ${pincode}`
        );
        modalWhatsAppBtn.href = `https://api.whatsapp.com/send?phone=${getWhatsAppNumber()}&text=${waText}`;
      }

      // Show Order Confirmation Modal
      if (successModalOverlay) {
        successModalOverlay.classList.add('active');
      }
    });
  }

  // WhatsApp Stylist Assistance button handler
  const whatsappAssistBtn = document.getElementById('whatsappAssistBtn');
  if (whatsappAssistBtn) {
    whatsappAssistBtn.addEventListener('click', () => {
      const saved = localStorage.getItem('dhouse_whatsapp_number');
      const waNumber = (saved && saved.trim()) ? saved.trim().replace(/[^0-9]/g, '') : '919898948986';
      const text = encodeURIComponent("Hi D'House Jewels, I need help completing my order");
      window.open(`https://api.whatsapp.com/send?phone=${waNumber || '919898948986'}&text=${text}`, '_blank');
    });
  }

  // 7. Apply Admin Payment Gateway & Toggle Settings
  function applyAdminPaymentSettings() {
    const enableRazorpay = localStorage.getItem('dhouse_enable_razorpay') !== 'false';
    const enableCod = localStorage.getItem('dhouse_enable_cod') !== 'false';
    const enableUpi = localStorage.getItem('dhouse_enable_upi') !== 'false';
    const enablePaytm = localStorage.getItem('dhouse_enable_paytm') !== 'false';

    const onlinePaymentCard = document.getElementById('onlinePaymentCard');
    const cardFields = document.getElementById('cardFields');
    const codPaymentCard = document.getElementById('codPaymentCard');
    const btnUpiInstant = document.getElementById('btnUpiInstant');
    const btnPaytmCards = document.getElementById('btnPaytmCards');
    const quickPayTitle = document.getElementById('quickPayTitle');
    const quickPayBtnsGrid = document.getElementById('quickPayBtnsGrid');

    // 1. Razorpay master toggle
    if (onlinePaymentCard) {
      onlinePaymentCard.style.display = enableRazorpay ? 'flex' : 'none';
      if (!enableRazorpay && codPaymentCard && enableCod) {
        onlinePaymentCard.classList.remove('active');
        const onlineRadio = onlinePaymentCard.querySelector('input[type="radio"]');
        if (onlineRadio) onlineRadio.checked = false;

        codPaymentCard.classList.add('active');
        const codRadio = codPaymentCard.querySelector('input[type="radio"]');
        if (codRadio) codRadio.checked = true;

        if (cardFields) cardFields.style.display = 'none';
        const codNotice = document.getElementById('codNotice');
        if (codNotice) codNotice.style.display = 'block';
      }
    }

    // 2. COD toggle
    if (codPaymentCard) {
      codPaymentCard.style.display = enableCod ? 'flex' : 'none';
    }

    // 3. Quick Payment Buttons toggle
    let visibleQuickCount = 0;
    if (btnUpiInstant) {
      btnUpiInstant.style.display = enableUpi ? 'flex' : 'none';
      if (enableUpi) visibleQuickCount++;
    }
    if (btnPaytmCards) {
      btnPaytmCards.style.display = enablePaytm ? 'flex' : 'none';
      if (enablePaytm) visibleQuickCount++;
    }

    if (quickPayTitle && quickPayBtnsGrid) {
      if (visibleQuickCount === 0 || !enableRazorpay) {
        quickPayTitle.style.display = 'none';
        quickPayBtnsGrid.style.display = 'none';
      } else {
        quickPayTitle.style.display = 'block';
        quickPayBtnsGrid.style.display = 'grid';
        quickPayBtnsGrid.style.gridTemplateColumns = visibleQuickCount === 1 ? '1fr' : 'repeat(2, 1fr)';
      }
    }
  }

  applyAdminPaymentSettings();

  // 8. Quick Payment Click Handlers
  const btnUpiInstant = document.getElementById('btnUpiInstant');
  if (btnUpiInstant) {
    btnUpiInstant.addEventListener('click', (e) => {
      e.preventDefault();
      const customUpi = localStorage.getItem('dhouse_upi_link') || '';
      if (customUpi && (customUpi.startsWith('http') || customUpi.startsWith('upi://'))) {
        window.open(customUpi, '_blank');
      }
      if (checkoutForm) {
        checkoutForm.requestSubmit();
      }
    });
  }

  const btnPaytmCards = document.getElementById('btnPaytmCards');
  if (btnPaytmCards) {
    btnPaytmCards.addEventListener('click', (e) => {
      e.preventDefault();
      const customPaytm = localStorage.getItem('dhouse_paytm_link') || '';
      if (customPaytm && customPaytm.startsWith('http')) {
        window.open(customPaytm, '_blank');
      }
      if (checkoutForm) {
        checkoutForm.requestSubmit();
      }
    });
  }
});
