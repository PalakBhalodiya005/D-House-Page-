/**
 * D'House Jewels - THE CLASS - Administrative Portal Logic
 * Order tracking, customer inquiry details, status updates,
 * and Razorpay payment link configuration.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 0. Admin Authentication Security
  // --------------------------------------------------------------------------
  const AUTH_EMAIL = 'admin@firevy.com';
  const AUTH_PASS = 'admin123';

  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboardView = document.getElementById('adminDashboardView');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminEmailInput = document.getElementById('adminEmailInput');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const loginErrorAlert = document.getElementById('loginErrorAlert');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  function checkAdminAuth() {
    const isAuth = sessionStorage.getItem('dhouse_admin_auth') === 'true';
    if (isAuth) {
      if (adminLoginView) adminLoginView.style.display = 'none';
      if (adminDashboardView) adminDashboardView.style.display = 'block';
      loadPaymentSettings();
      renderDashboard();
    } else {
      if (adminLoginView) adminLoginView.style.display = 'flex';
      if (adminDashboardView) adminDashboardView.style.display = 'none';
    }
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEmail = (adminEmailInput ? adminEmailInput.value : '').trim().toLowerCase();
      const inputPass = adminPasswordInput ? adminPasswordInput.value : '';

      if (inputEmail === AUTH_EMAIL && inputPass === AUTH_PASS) {
        if (loginErrorAlert) loginErrorAlert.style.display = 'none';
        sessionStorage.setItem('dhouse_admin_auth', 'true');
        checkAdminAuth();
      } else {
        if (loginErrorAlert) {
          loginErrorAlert.style.display = 'block';
          loginErrorAlert.textContent = 'Invalid ID or Password. Please try again.';
        }
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('dhouse_admin_auth');
      if (adminPasswordInput) adminPasswordInput.value = '';
      if (loginErrorAlert) loginErrorAlert.style.display = 'none';
      checkAdminAuth();
    });
  }

  // --------------------------------------------------------------------------
  // 1. Navigation Tabs
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // --------------------------------------------------------------------------
  // 2. Razorpay & Payment Gateway Configuration
  // --------------------------------------------------------------------------
  const razorpayLinkForm = document.getElementById('razorpayLinkForm');
  const toggleRazorpay = document.getElementById('toggleRazorpay');
  const razorpayLinkInput = document.getElementById('razorpayLinkInput');
  const toggleUpi = document.getElementById('toggleUpi');
  const upiLinkInput = document.getElementById('upiLinkInput');
  const togglePaytm = document.getElementById('togglePaytm');
  const paytmLinkInput = document.getElementById('paytmLinkInput');
  const toggleCod = document.getElementById('toggleCod');
  const merchantNameInput = document.getElementById('merchantNameInput');
  const whatsappNumberInput = document.getElementById('whatsappNumberInput');
  const configSaveAlert = document.getElementById('configSaveAlert');

  // Load saved settings
  function loadPaymentSettings() {
    const enableRazorpay = localStorage.getItem('dhouse_enable_razorpay') !== 'false';
    const savedLink = localStorage.getItem('dhouse_razorpay_link') || '';
    const enableUpi = localStorage.getItem('dhouse_enable_upi') !== 'false';
    const savedUpi = localStorage.getItem('dhouse_upi_link') || localStorage.getItem('dhouse_upi_id') || 'dhousejewels@upi';
    const enablePaytm = localStorage.getItem('dhouse_enable_paytm') !== 'false';
    const savedPaytm = localStorage.getItem('dhouse_paytm_link') || '';
    const enableCod = localStorage.getItem('dhouse_enable_cod') !== 'false';
    const savedMerchant = localStorage.getItem('dhouse_merchant_name') || "D'House Jewels - THE CLASS";
    const savedWhatsApp = localStorage.getItem('dhouse_whatsapp_number') || '919898948986';

    if (toggleRazorpay) toggleRazorpay.checked = enableRazorpay;
    if (razorpayLinkInput) razorpayLinkInput.value = savedLink;
    if (toggleUpi) toggleUpi.checked = enableUpi;
    if (upiLinkInput) upiLinkInput.value = savedUpi;
    if (togglePaytm) togglePaytm.checked = enablePaytm;
    if (paytmLinkInput) paytmLinkInput.value = savedPaytm;
    if (toggleCod) toggleCod.checked = enableCod;
    if (merchantNameInput) merchantNameInput.value = savedMerchant;
    if (whatsappNumberInput) whatsappNumberInput.value = savedWhatsApp;

    // Update active badge in metrics
    const metricGatewayStatus = document.getElementById('metricGatewayStatus');
    if (metricGatewayStatus) {
      metricGatewayStatus.textContent = savedLink ? 'Link Configured' : 'Default / Test';
      metricGatewayStatus.style.color = savedLink ? '#2e7d32' : '#d97706';
    }
  }

  // Save Settings
  if (razorpayLinkForm) {
    razorpayLinkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cleanWa = whatsappNumberInput ? whatsappNumberInput.value.trim().replace(/[^0-9]/g, '') : '919898948986';

      localStorage.setItem('dhouse_enable_razorpay', toggleRazorpay ? String(toggleRazorpay.checked) : 'true');
      localStorage.setItem('dhouse_razorpay_link', razorpayLinkInput ? razorpayLinkInput.value.trim() : '');
      localStorage.setItem('dhouse_enable_upi', toggleUpi ? String(toggleUpi.checked) : 'true');
      localStorage.setItem('dhouse_upi_link', upiLinkInput ? upiLinkInput.value.trim() : '');
      localStorage.setItem('dhouse_enable_paytm', togglePaytm ? String(togglePaytm.checked) : 'true');
      localStorage.setItem('dhouse_paytm_link', paytmLinkInput ? paytmLinkInput.value.trim() : '');
      localStorage.setItem('dhouse_enable_cod', toggleCod ? String(toggleCod.checked) : 'true');
      localStorage.setItem('dhouse_merchant_name', merchantNameInput ? merchantNameInput.value.trim() : '');
      localStorage.setItem('dhouse_whatsapp_number', cleanWa || '919898948986');

      if (configSaveAlert) {
        configSaveAlert.style.display = 'block';
        configSaveAlert.textContent = 'Settings and WhatsApp number saved successfully! Checkout is now updated.';
        setTimeout(() => {
          configSaveAlert.style.display = 'none';
        }, 4000);
      }

      loadPaymentSettings();
    });
  }

  // --------------------------------------------------------------------------
  // 3. Orders Management & Metrics
  // --------------------------------------------------------------------------
  const ordersTableBody = document.getElementById('ordersTableBody');
  const emptyOrdersState = document.getElementById('emptyOrdersState');
  const metricTotalRevenue = document.getElementById('metricTotalRevenue');
  const metricTotalOrders = document.getElementById('metricTotalOrders');
  const metricPendingFulfillment = document.getElementById('metricPendingFulfillment');
  const tabOrdersBadge = document.getElementById('tabOrdersBadge');

  const orderSearchInput = document.getElementById('orderSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearAllOrdersBtn = document.getElementById('clearAllOrdersBtn');
  const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');

  // Modal elements
  const orderModalOverlay = document.getElementById('orderModalOverlay');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
  const modalDetailOrderId = document.getElementById('modalDetailOrderId');
  const modalDetailDate = document.getElementById('modalDetailDate');
  const modalDetailCustomer = document.getElementById('modalDetailCustomer');
  const modalDetailPhone = document.getElementById('modalDetailPhone');
  const modalDetailEmail = document.getElementById('modalDetailEmail');
  const modalDetailAddress = document.getElementById('modalDetailAddress');
  const modalDetailItem = document.getElementById('modalDetailItem');
  const modalDetailSpecs = document.getElementById('modalDetailSpecs');
  const modalDetailTotal = document.getElementById('modalDetailTotal');
  const modalDetailPayment = document.getElementById('modalDetailPayment');
  const modalStatusSelect = document.getElementById('modalStatusSelect');
  const modalWhatsAppCustomerBtn = document.getElementById('modalWhatsAppCustomerBtn');

  let currentActiveFilter = 'all';
  let activeSelectedOrderId = null;

  function getOrders() {
    try {
      const raw = localStorage.getItem('dhouse_orders');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return [];
  }

  function saveOrders(orders) {
    try {
      localStorage.setItem('dhouse_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }

  function formatINR(number) {
    return '₹' + Math.max(0, Math.round(number)).toLocaleString('en-IN');
  }

  function renderDashboard() {
    const orders = getOrders();
    const searchQuery = orderSearchInput ? orderSearchInput.value.toLowerCase().trim() : '';

    // Calculate metrics
    let totalRev = 0;
    let pendingCount = 0;

    orders.forEach((o) => {
      // Clean numeric total
      const numTotal = parseInt(String(o.total || '0').replace(/[^0-9]/g, ''), 10) || 0;
      totalRev += numTotal;
      if (o.status === 'Confirmed' || o.status === 'Crafting') {
        pendingCount++;
      }
    });

    if (metricTotalRevenue) metricTotalRevenue.textContent = formatINR(totalRev);
    if (metricTotalOrders) metricTotalOrders.textContent = orders.length;
    if (metricPendingFulfillment) metricPendingFulfillment.textContent = pendingCount;
    if (tabOrdersBadge) tabOrdersBadge.textContent = orders.length;

    // Filter orders
    const filtered = orders.filter((o) => {
      const matchesFilter =
        currentActiveFilter === 'all' ||
        (currentActiveFilter === 'cod' && o.paymentMethod === 'cod') ||
        o.status.toLowerCase() === currentActiveFilter.toLowerCase();

      const customerName = `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase();
      const orderIdStr = (o.orderId || '').toLowerCase();
      const cityStr = (o.customer?.city || '').toLowerCase();

      const matchesSearch =
        !searchQuery ||
        customerName.includes(searchQuery) ||
        orderIdStr.includes(searchQuery) ||
        cityStr.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });

    // Render Table
    if (ordersTableBody) {
      ordersTableBody.innerHTML = '';

      if (filtered.length === 0) {
        if (emptyOrdersState) emptyOrdersState.style.display = 'block';
      } else {
        if (emptyOrdersState) emptyOrdersState.style.display = 'none';

        filtered.forEach((order) => {
          const tr = document.createElement('tr');

          const statusClass = (order.status || 'confirmed').toLowerCase();
          const customerFullName = `${order.customer?.firstName || 'Valued'} ${order.customer?.lastName || 'Client'}`;
          const itemTitle = order.item?.title || 'Luster Bracelet';
          const itemImg = order.item?.image || 'images/circle_silver.jpg';
          const itemSpecs = `${order.item?.metal || 'Silver'} (${order.item?.purity || '92.5%'}) • ${order.item?.diamond || 'Moissanite'} • ${order.item?.size || '3 mm'}`;

          tr.innerHTML = `
            <td><span class="order-id-badge">${order.orderId}</span></td>
            <td>
              <div style="font-weight: 600; color: var(--text-heading);">${customerFullName}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${order.customer?.phone || order.customer?.emailOrPhone || 'N/A'}</div>
            </td>
            <td>
              <div class="item-thumb-row">
                <img src="${itemImg}" alt="${itemTitle}">
                <div>
                  <div style="font-weight: 500;">${itemTitle} x ${order.item?.quantity || 1}</div>
                  <div class="item-spec-mini">${itemSpecs}</div>
                </div>
              </div>
            </td>
            <td style="font-weight: 700; color: var(--primary-burgundy);">${order.total || '₹48,500'}</td>
            <td>
              <span style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: ${order.paymentMethod === 'cod' ? '#7c3aed' : '#2e7d32'};">
                ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Online'}
              </span>
            </td>
            <td>
              <span class="status-badge ${statusClass}">${order.status || 'Confirmed'}</span>
            </td>
            <td>
              <div class="action-btns">
                <button type="button" class="action-icon-btn btn-view-order" data-id="${order.orderId}" title="View Complete Order Details">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
                <button type="button" class="action-icon-btn btn-whatsapp-order" data-id="${order.orderId}" title="Message on WhatsApp">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.17c-.24.68-1.2 1.34-1.89 1.48-.48.1-1.09.18-3.17-.68-2.67-1.1-4.41-3.79-4.54-3.97-.13-.18-1.08-1.44-1.08-2.75 0-1.31.69-1.95.93-2.22.25-.26.54-.33.72-.33.19 0 .37 0 .53.01.17.01.4.06.63.54.23.49.8 1.95.87 2.1.07.14.11.31.02.5-.09.18-.13.3-.27.46-.13.16-.28.36-.4.49-.13.14-.27.29-.12.56.16.27.7 1.15 1.5 1.86 1.03.92 1.9 1.2 2.17 1.34.27.13.43.11.59-.07.16-.18.69-.8.87-1.08.19-.27.37-.23.63-.13.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.11.07.66-.17 1.34z"></path></svg>
                </button>
                <button type="button" class="action-icon-btn btn-delete-order" data-id="${order.orderId}" title="Delete Order" style="color: #c62828;">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          `;

          ordersTableBody.appendChild(tr);
        });

        attachActionListeners();
      }
    }
  }

  function attachActionListeners() {
    document.querySelectorAll('.btn-view-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openOrderModal(id);
      });
    });

    document.querySelectorAll('.btn-whatsapp-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openWhatsAppForOrder(id);
      });
    });

    document.querySelectorAll('.btn-delete-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete order ${id}?`)) {
          let orders = getOrders();
          orders = orders.filter((o) => o.orderId !== id);
          saveOrders(orders);
          renderDashboard();
        }
      });
    });
  }

  function openOrderModal(orderId) {
    const orders = getOrders();
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;

    activeSelectedOrderId = orderId;

    if (modalDetailOrderId) modalDetailOrderId.textContent = order.orderId;
    if (modalDetailDate) modalDetailDate.textContent = order.formattedDate || new Date(order.date).toLocaleString();
    if (modalDetailCustomer) {
      modalDetailCustomer.textContent = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`;
    }
    if (modalDetailPhone) modalDetailPhone.textContent = order.customer?.phone || order.customer?.emailOrPhone || 'N/A';
    if (modalDetailEmail) modalDetailEmail.textContent = order.customer?.emailOrPhone || 'N/A';
    if (modalDetailAddress) {
      const apt = order.customer?.apartment ? `${order.customer.apartment}, ` : '';
      modalDetailAddress.textContent = `${order.customer?.address || ''}, ${apt}${order.customer?.city || ''}, ${order.customer?.state || ''} - ${order.customer?.pincode || ''}`;
    }
    if (modalDetailItem) {
      modalDetailItem.textContent = `${order.item?.title || 'Luster Bracelet'} x ${order.item?.quantity || 1}`;
    }
    if (modalDetailSpecs) {
      modalDetailSpecs.textContent = `Metal: ${order.item?.metal} (${order.item?.purity}) | Color: ${order.item?.color} | Diamond: ${order.item?.diamond} | Size: ${order.item?.size} | Certificate: ${order.item?.certificate}`;
    }
    if (modalDetailTotal) modalDetailTotal.textContent = order.total;
    if (modalDetailPayment) {
      modalDetailPayment.textContent = order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure Online';
    }
    if (modalStatusSelect) {
      modalStatusSelect.value = order.status || 'Confirmed';
    }

    if (orderModalOverlay) {
      orderModalOverlay.classList.add('active');
    }
  }

  function openWhatsAppForOrder(orderId) {
    const orders = getOrders();
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;

    let phone = (order.customer?.phone || order.customer?.emailOrPhone || '').replace(/[^0-9]/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const message = encodeURIComponent(
      `Hello ${order.customer?.firstName || 'Valued Client'}! This is D'House Jewels regarding your order ${order.orderId} for the Luster Bracelet. Current Status: ${order.status}. Please let us know if you have any questions!`
    );

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, '_blank');
  }

  // Status Change in Modal
  if (modalStatusSelect) {
    modalStatusSelect.addEventListener('change', () => {
      if (!activeSelectedOrderId) return;
      const orders = getOrders();
      const idx = orders.findIndex((o) => o.orderId === activeSelectedOrderId);
      if (idx !== -1) {
        orders[idx].status = modalStatusSelect.value;
        saveOrders(orders);
        renderDashboard();
      }
    });
  }

  if (closeOrderModalBtn && orderModalOverlay) {
    closeOrderModalBtn.addEventListener('click', () => {
      orderModalOverlay.classList.remove('active');
    });
  }

  if (modalWhatsAppCustomerBtn) {
    modalWhatsAppCustomerBtn.addEventListener('click', () => {
      if (activeSelectedOrderId) {
        openWhatsAppForOrder(activeSelectedOrderId);
      }
    });
  }

  // Filters & Search
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveFilter = btn.getAttribute('data-filter');
      renderDashboard();
    });
  });

  if (orderSearchInput) {
    orderSearchInput.addEventListener('input', renderDashboard);
  }

  // Clear all orders
  if (clearAllOrdersBtn) {
    clearAllOrdersBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all order history?')) {
        localStorage.removeItem('dhouse_orders');
        renderDashboard();
      }
    });
  }

  // Refresh orders handler
  if (refreshOrdersBtn) {
    refreshOrdersBtn.addEventListener('click', () => {
      const icon = refreshOrdersBtn.querySelector('.refresh-icon');
      if (icon) {
        icon.classList.remove('spinning');
        void icon.offsetWidth; // trigger reflow
        icon.classList.add('spinning');
      }
      renderDashboard();
    });
  }

  // Check session authentication on load
  checkAdminAuth();
});
