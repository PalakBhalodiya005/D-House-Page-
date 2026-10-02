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
      if (adminDashboardView) adminDashboardView.style.display = 'flex';
      loadPaymentSettings();
      loadProductSettings();
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
  // 1. Navigation Tabs & Sidebar Mobile Controls
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const adminSidebar = document.getElementById('adminSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function closeMobileSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  const topbarPageTitle = document.querySelector('.topbar-page-title');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');

      if (topbarPageTitle) {
        if (targetId === 'tabOrders') {
          topbarPageTitle.textContent = 'Executive Dashboard';
        } else if (targetId === 'tabPaymentSettings') {
          topbarPageTitle.textContent = 'Payment Gateway Settings';
        } else if (targetId === 'tabProductSettings') {
          topbarPageTitle.textContent = 'Product Edit & Variants';
        }
      }

      closeMobileSidebar();
    });
  });

  if (sidebarToggleBtn && adminSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      adminSidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

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
  // 2.b. Shopify-Style Product Customizer & Dynamic Pricing Manager
  // --------------------------------------------------------------------------
  const shopifyVariantsTableBody = document.getElementById('shopifyVariantsTableBody');
  const productSaveAlert = document.getElementById('productSaveAlert');
  const saveProductSettingsBtn = document.getElementById('saveProductSettingsBtn');
  const btnSaveVariantsTop = document.getElementById('btnSaveVariantsTop');
  const resetProductSettingsBtn = document.getElementById('resetProductSettingsBtn');
  const shopifyGroupBySelect = document.getElementById('shopifyGroupBySelect');
  const selectAllVariantsCheckbox = document.getElementById('selectAllVariantsCheckbox');
  const btnToggleAllGroups = document.getElementById('btnToggleAllGroups');
  const btnAddVariantTop = document.getElementById('btnAddVariantTop');
  const btnAddOptionRow = document.getElementById('btnAddOptionRow');
  const shopifyTotalAvailable = document.getElementById('shopifyTotalAvailable');

  const defaultProductConfig = {
    title: 'Luster Bracelet',
    tagline: 'Luster — brilliance that speaks from every angle.',
    metals: {
      'Silver': { price: 260, purity: '92.5% Pure Silver', colorName: 'White Gold', swatch: '#d1d5db', img: 'images/wrist_silver.jpg', sku: 'LNK-41-W' },
      '9K Gold': { price: 480, purity: '40% Pure Gold', colorName: 'Yellow Gold', swatch: '#e5a93c', img: 'images/wrist_9k.jpg', sku: 'LNK-41-Y' },
      '14K Gold': { price: 750, purity: '59% Pure Gold', colorName: 'Rose Gold', swatch: '#b76e79', img: 'images/wrist_14k.jpg', sku: 'LNK-41-RG' },
      '18K Gold': { price: 990, purity: '76% Pure Gold', colorName: 'Dark Rose Gold', swatch: '#b88e38', img: 'images/wrist_18k.jpg', sku: 'LNK-41-18K' }
    },
    diamonds: {
      'Moissanite': { addPrice: 0, subtitle: 'Brilliant shine, great value' },
      'CVD': { addPrice: 150, subtitle: 'Lab grown, identical brilliance' },
      'Natural': { addPrice: 450, subtitle: 'Rare, authentic, timeless' }
    },
    sizes: {
      '2 mm': { addPrice: -40 },
      '3 mm': { addPrice: 0 },
      '4 mm': { addPrice: 80 }
    },
    variantOverrides: {}
  };

  let currentProductConfig = JSON.parse(JSON.stringify(defaultProductConfig));

  function parseCleanNumber(val) {
    if (typeof val === 'number') return Math.round(val);
    if (!val) return 0;
    let str = String(val).trim().replace(/,/g, '');
    const isNegative = str.includes('-');
    str = str.replace(/[^0-9.]/g, '');
    const num = parseFloat(str);
    if (isNaN(num)) return 0;
    const result = Math.round(num);
    return isNegative ? -result : result;
  }

  function formatPriceValue(val) {
    const num = parseCleanNumber(val);
    return num.toLocaleString('en-US') + '.00';
  }

  function getSavedProductConfig() {
    try {
      const raw = localStorage.getItem('dhouse_product_config');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.metals && parsed.metals.Silver && parsed.metals.Silver.price > 5000) {
          localStorage.removeItem('dhouse_product_config');
          localStorage.removeItem('dhouse_variant_prices');
          return JSON.parse(JSON.stringify(defaultProductConfig));
        }
        return Object.assign({}, defaultProductConfig, parsed);
      }
    } catch (e) {
      console.warn('Error reading dhouse_product_config:', e);
    }
    return JSON.parse(JSON.stringify(defaultProductConfig));
  }

  function getCombinationPrice(mKey, dKey, sKey) {
    const overrides = currentProductConfig.variantOverrides || {};
    const exactKey = `${mKey}::${dKey}::${sKey}`;
    if (overrides[exactKey] !== undefined) {
      return parseCleanNumber(overrides[exactKey]);
    }
    // Check 2-way fallback
    if (overrides[`${mKey}::${dKey}`] !== undefined) {
      const sizeDiff = currentProductConfig.sizes?.[sKey]?.addPrice ?? 0;
      return parseCleanNumber(overrides[`${mKey}::${dKey}`]) + sizeDiff;
    }
    // Base formula
    const basePrice = currentProductConfig.metals?.[mKey]?.price ?? 260;
    const diamondAdd = currentProductConfig.diamonds?.[dKey]?.addPrice ?? 0;
    const sizeAdd = currentProductConfig.sizes?.[sKey]?.addPrice ?? 0;
    return basePrice + diamondAdd + sizeAdd;
  }

  function renderShopifyVariantsTable() {
    if (!shopifyVariantsTableBody) return;
    shopifyVariantsTableBody.innerHTML = '';

    const config = currentProductConfig;
    const metals = config.metals || defaultProductConfig.metals;
    const diamonds = config.diamonds || defaultProductConfig.diamonds;
    const sizes = config.sizes || defaultProductConfig.sizes;

    const groupBy = shopifyGroupBySelect ? shopifyGroupBySelect.value : 'metal';
    const metalKeys = Object.keys(metals);
    const diamondKeys = Object.keys(diamonds);
    const sizeKeys = Object.keys(sizes);
    let totalVariantCount = 0;

    if (groupBy === 'diamond') {
      // 1. Group By: Diamond Selection
      diamondKeys.forEach((dKey, groupIdx) => {
        const dInfo = diamonds[dKey] || {};
        const addOn = dInfo.addPrice ?? 0;
        const groupId = `group-d-${groupIdx}`;
        const subVariantCount = metalKeys.length * sizeKeys.length;

        // Master Diamond Group Row
        const groupTr = document.createElement('tr');
        groupTr.className = 'variant-group-row';
        groupTr.setAttribute('data-group-id', groupId);

        groupTr.innerHTML = `
          <td>
            <input type="checkbox" class="shopify-checkbox group-checkbox" data-group="${groupId}">
          </td>
          <td>
            <div class="variant-title-wrap">
              <div class="variant-thumb-box">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#008060" stroke-width="1.8" fill="none">
                  <polygon points="6 3 18 3 22 9 12 22 2 9 6 3"></polygon>
                  <line x1="2" y1="9" x2="22" y2="9"></line>
                </svg>
              </div>
              <div>
                <div class="variant-title-text">
                  <span>${dKey}</span>
                  <span class="variant-dot"></span>
                  <span class="variant-count-tag">${subVariantCount} variants</span>
                </div>
                <div style="font-size: 11px; color: #6d7175; margin-top: 1px;">${dInfo.subtitle || 'Diamond Selection'}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="shopify-price-input-box">
              <span class="price-currency-symbol">+$</span>
              <input type="text" class="shopify-price-input master-diamond-addon" data-diamond-key="${dKey}" value="${formatPriceValue(addOn)}">
            </div>
          </td>
          <td><span style="font-weight: 500; color: #202223;">0</span></td>
          <td>
            <div class="publishing-channels">
              <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 2</span>
              <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 0</span>
            </div>
          </td>
          <td style="text-align: right;">
            <button type="button" class="shopify-row-toggle-btn" data-toggle="${groupId}" title="Collapse / Expand">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
          </td>
        `;
        shopifyVariantsTableBody.appendChild(groupTr);

        // Child rows: Metal x Size
        let childIdx = 0;
        metalKeys.forEach((mKey) => {
          const mInfo = metals[mKey] || {};
          const thumbSrc = mInfo.img || 'images/wrist_silver.jpg';
          sizeKeys.forEach((sKey) => {
            totalVariantCount++;
            childIdx++;
            const isLast = childIdx === subVariantCount;
            const combPrice = getCombinationPrice(mKey, dKey, sKey);
            const overrideKey = `${mKey}::${dKey}::${sKey}`;

            const subTr = document.createElement('tr');
            subTr.className = `variant-sub-row child-of-${groupId}`;
            subTr.innerHTML = `
              <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span class="tree-line">${isLast ? '└──' : '├──'}</span>
                  <input type="checkbox" class="shopify-checkbox sub-checkbox" data-group="${groupId}">
                </div>
              </td>
              <td>
                <div class="variant-sub-indent">
                  <div class="variant-thumb-box" style="width: 32px; height: 32px;">
                    <img src="${thumbSrc}" alt="${mKey}">
                  </div>
                  <div>
                    <div style="display: flex; align-items: center;">
                      <span style="font-weight: 500; color: #202223;">${mKey} / ${sKey}</span>
                      <span class="badge-new">New</span>
                    </div>
                    <div class="sku-badge">${mInfo.sku || 'LNK'}-${childIdx} • ${mInfo.purity || 'Bespoke'}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="shopify-price-input-box">
                  <span class="price-currency-symbol">$</span>
                  <input type="text" class="shopify-price-input sub-variant-price" data-metal-key="${mKey}" data-diamond-key="${dKey}" data-size-key="${sKey}" data-override-key="${overrideKey}" value="${formatPriceValue(combPrice)}">
                </div>
              </td>
              <td><span style="color: #6d7175;">0</span></td>
              <td>
                <div class="publishing-channels">
                  <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 2</span>
                  <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 0</span>
                </div>
              </td>
              <td></td>
            `;
            shopifyVariantsTableBody.appendChild(subTr);
          });
        });
      });

    } else if (groupBy === 'size') {
      // 2. Group By: Diamond Size
      sizeKeys.forEach((sKey, groupIdx) => {
        const sInfo = sizes[sKey] || {};
        const addOn = sInfo.addPrice ?? 0;
        const groupId = `group-s-${groupIdx}`;
        const subVariantCount = metalKeys.length * diamondKeys.length;

        // Master Size Group Row
        const groupTr = document.createElement('tr');
        groupTr.className = 'variant-group-row';
        groupTr.setAttribute('data-group-id', groupId);

        groupTr.innerHTML = `
          <td>
            <input type="checkbox" class="shopify-checkbox group-checkbox" data-group="${groupId}">
          </td>
          <td>
            <div class="variant-title-wrap">
              <div class="variant-thumb-box">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#008060" stroke-width="1.8" fill="none">
                  <circle cx="12" cy="12" r="9"></circle>
                  <polyline points="12 7 12 12 15 14"></polyline>
                </svg>
              </div>
              <div>
                <div class="variant-title-text">
                  <span>${sKey}</span>
                  <span class="variant-dot"></span>
                  <span class="variant-count-tag">${subVariantCount} variants</span>
                </div>
                <div style="font-size: 11px; color: #6d7175; margin-top: 1px;">Diamond Dimension</div>
              </div>
            </div>
          </td>
          <td>
            <div class="shopify-price-input-box">
              <span class="price-currency-symbol">${addOn >= 0 ? '+$' : '-$'}</span>
              <input type="text" class="shopify-price-input master-size-addon" data-size-key="${sKey}" value="${formatPriceValue(Math.abs(addOn))}">
            </div>
          </td>
          <td><span style="font-weight: 500; color: #202223;">0</span></td>
          <td>
            <div class="publishing-channels">
              <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 2</span>
              <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 0</span>
            </div>
          </td>
          <td style="text-align: right;">
            <button type="button" class="shopify-row-toggle-btn" data-toggle="${groupId}" title="Collapse / Expand">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
          </td>
        `;
        shopifyVariantsTableBody.appendChild(groupTr);

        // Child rows: Metal x Diamond
        let childIdx = 0;
        metalKeys.forEach((mKey) => {
          const mInfo = metals[mKey] || {};
          const thumbSrc = mInfo.img || 'images/wrist_silver.jpg';
          diamondKeys.forEach((dKey) => {
            totalVariantCount++;
            childIdx++;
            const isLast = childIdx === subVariantCount;
            const combPrice = getCombinationPrice(mKey, dKey, sKey);
            const overrideKey = `${mKey}::${dKey}::${sKey}`;

            const subTr = document.createElement('tr');
            subTr.className = `variant-sub-row child-of-${groupId}`;
            subTr.innerHTML = `
              <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span class="tree-line">${isLast ? '└──' : '├──'}</span>
                  <input type="checkbox" class="shopify-checkbox sub-checkbox" data-group="${groupId}">
                </div>
              </td>
              <td>
                <div class="variant-sub-indent">
                  <div class="variant-thumb-box" style="width: 32px; height: 32px;">
                    <img src="${thumbSrc}" alt="${mKey}">
                  </div>
                  <div>
                    <div style="display: flex; align-items: center;">
                      <span style="font-weight: 500; color: #202223;">${mKey} / ${dKey}</span>
                      <span class="badge-new">New</span>
                    </div>
                    <div class="sku-badge">${mInfo.sku || 'LNK'}-${childIdx} • ${sKey}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="shopify-price-input-box">
                  <span class="price-currency-symbol">$</span>
                  <input type="text" class="shopify-price-input sub-variant-price" data-metal-key="${mKey}" data-diamond-key="${dKey}" data-size-key="${sKey}" data-override-key="${overrideKey}" value="${formatPriceValue(combPrice)}">
                </div>
              </td>
              <td><span style="color: #6d7175;">0</span></td>
              <td>
                <div class="publishing-channels">
                  <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 2</span>
                  <span class="publishing-channel-item"><svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 0</span>
                </div>
              </td>
              <td></td>
            `;
            shopifyVariantsTableBody.appendChild(subTr);
          });
        });
      });

    } else {
      // 3. Default Group By: Metal Selection (matching Shopify style perfectly)
      metalKeys.forEach((mKey, groupIdx) => {
        const metalInfo = metals[mKey] || {};
        const basePrice = metalInfo.price ?? 260;
        const colorTitle = metalInfo.colorName || mKey;
        const thumbSrc = metalInfo.img || 'images/wrist_silver.jpg';
        const skuPrefix = metalInfo.sku || `LNK-41-${groupIdx + 1}`;
        const groupId = `group-${groupIdx}`;
        const subVariantCount = diamondKeys.length * sizeKeys.length;

        // Master Group Row
        const groupTr = document.createElement('tr');
        groupTr.className = 'variant-group-row';
        groupTr.setAttribute('data-group-id', groupId);

        groupTr.innerHTML = `
          <td>
            <input type="checkbox" class="shopify-checkbox group-checkbox" data-group="${groupId}">
          </td>
          <td>
            <div class="variant-title-wrap">
              <div class="variant-thumb-box">
                <img src="${thumbSrc}" alt="${mKey}">
              </div>
              <div>
                <div class="variant-title-text">
                  <span>${mKey}</span>
                  <span class="variant-dot"></span>
                  <span class="variant-count-tag">${subVariantCount} variants</span>
                </div>
                <div style="font-size: 11px; color: #6d7175; margin-top: 1px;">${metalInfo.purity || mKey}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="shopify-price-input-box">
              <span class="price-currency-symbol">$</span>
              <input type="text" class="shopify-price-input master-group-price" data-metal-key="${mKey}" value="${formatPriceValue(basePrice)}">
            </div>
          </td>
          <td>
            <span style="font-weight: 500; color: #202223;">0</span>
          </td>
          <td>
            <div class="publishing-channels">
              <span class="publishing-channel-item" title="Online store & Sales Channels">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                2
              </span>
              <span class="publishing-channel-item" title="Markets">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                0
              </span>
            </div>
          </td>
          <td style="text-align: right;">
            <button type="button" class="shopify-row-toggle-btn" data-toggle="${groupId}" title="Collapse / Expand">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </td>
        `;

        shopifyVariantsTableBody.appendChild(groupTr);

        // Child Sub-Variant Rows: Diamond x Size (e.g. Moissanite / 2 mm, Moissanite / 3 mm, CVD / 2 mm...)
        let childIdx = 0;
        diamondKeys.forEach((dKey) => {
          sizeKeys.forEach((sKey) => {
            totalVariantCount++;
            childIdx++;
            const isLast = childIdx === subVariantCount;
            const combPrice = getCombinationPrice(mKey, dKey, sKey);
            const subSku = `${skuPrefix}-${childIdx}`;
            const overrideKey = `${mKey}::${dKey}::${sKey}`;

            const subTr = document.createElement('tr');
            subTr.className = `variant-sub-row child-of-${groupId}`;

            subTr.innerHTML = `
              <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span class="tree-line">${isLast ? '└──' : '├──'}</span>
                  <input type="checkbox" class="shopify-checkbox sub-checkbox" data-group="${groupId}">
                </div>
              </td>
              <td>
                <div class="variant-sub-indent">
                  <div class="variant-thumb-box" style="width: 32px; height: 32px;">
                    <img src="${thumbSrc}" alt="${colorTitle}">
                  </div>
                  <div>
                    <div style="display: flex; align-items: center;">
                      <span style="font-weight: 500; color: #202223;">${dKey} / ${sKey}</span>
                      <span class="badge-new">New</span>
                    </div>
                    <div class="sku-badge">${subSku} • ${sKey}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="shopify-price-input-box">
                  <span class="price-currency-symbol">$</span>
                  <input type="text" class="shopify-price-input sub-variant-price" data-metal-key="${mKey}" data-diamond-key="${dKey}" data-size-key="${sKey}" data-override-key="${overrideKey}" value="${formatPriceValue(combPrice)}">
                </div>
              </td>
              <td>
                <span style="color: #6d7175;">0</span>
              </td>
              <td>
                <div class="publishing-channels">
                  <span class="publishing-channel-item">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    2
                  </span>
                  <span class="publishing-channel-item">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    0
                  </span>
                </div>
              </td>
              <td></td>
            `;

            shopifyVariantsTableBody.appendChild(subTr);
          });
        });
      });
    }

    if (shopifyTotalAvailable) {
      shopifyTotalAvailable.textContent = `${totalVariantCount} options active in boutique catalog`;
    }

    attachShopifyTableInteractions();
  }

  function attachShopifyTableInteractions() {
    // Group Collapse/Expand toggles
    document.querySelectorAll('.shopify-row-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const groupId = btn.getAttribute('data-toggle');
        const childRows = document.querySelectorAll(`.child-of-${groupId}`);
        const isCollapsed = btn.classList.toggle('collapsed');

        childRows.forEach((row) => {
          row.style.display = isCollapsed ? 'none' : 'table-row';
        });
      });
    });

    // Checkbox Master / Group selection
    document.querySelectorAll('.group-checkbox').forEach((gBox) => {
      gBox.addEventListener('change', () => {
        const groupId = gBox.getAttribute('data-group');
        const subBoxes = document.querySelectorAll(`.sub-checkbox[data-group="${groupId}"]`);
        subBoxes.forEach((sBox) => {
          sBox.checked = gBox.checked;
        });
      });
    });

    // Auto-select text on click/focus for all price inputs
    document.querySelectorAll('.shopify-price-input').forEach((input) => {
      input.addEventListener('focus', () => {
        input.select();
      });
    });

    // Master Group Price edit (when grouped by metal) -> automatically update sub-variant inputs
    document.querySelectorAll('.master-group-price').forEach((input) => {
      input.addEventListener('change', () => {
        const mKey = input.getAttribute('data-metal-key');
        const newBase = parseCleanNumber(input.value);
        input.value = formatPriceValue(newBase);

        if (currentProductConfig.metals && currentProductConfig.metals[mKey]) {
          currentProductConfig.metals[mKey].price = newBase;
        }

        // Update child sub-inputs
        const childInputs = document.querySelectorAll(`.sub-variant-price[data-metal-key="${mKey}"]`);
        childInputs.forEach((subInput) => {
          const dKey = subInput.getAttribute('data-diamond-key');
          const sKey = subInput.getAttribute('data-size-key');
          const dAdd = currentProductConfig.diamonds?.[dKey]?.addPrice ?? 0;
          const sAdd = currentProductConfig.sizes?.[sKey]?.addPrice ?? 0;
          const calculatedPrice = newBase + dAdd + sAdd;
          subInput.value = formatPriceValue(calculatedPrice);
          const overrideKey = `${mKey}::${dKey}::${sKey}`;
          if (!currentProductConfig.variantOverrides) currentProductConfig.variantOverrides = {};
          currentProductConfig.variantOverrides[overrideKey] = calculatedPrice;
        });
      });
    });

    // Master Diamond Addon edit (when grouped by diamond)
    document.querySelectorAll('.master-diamond-addon').forEach((input) => {
      input.addEventListener('change', () => {
        const dKey = input.getAttribute('data-diamond-key');
        const newAddon = parseCleanNumber(input.value);
        input.value = formatPriceValue(newAddon);

        if (currentProductConfig.diamonds && currentProductConfig.diamonds[dKey]) {
          currentProductConfig.diamonds[dKey].addPrice = newAddon;
        }

        // Update child sub-inputs
        const childInputs = document.querySelectorAll(`.sub-variant-price[data-diamond-key="${dKey}"]`);
        childInputs.forEach((subInput) => {
          const mKey = subInput.getAttribute('data-metal-key');
          const sKey = subInput.getAttribute('data-size-key');
          const basePrice = currentProductConfig.metals?.[mKey]?.price ?? 260;
          const sAdd = currentProductConfig.sizes?.[sKey]?.addPrice ?? 0;
          const calculatedPrice = basePrice + newAddon + sAdd;
          subInput.value = formatPriceValue(calculatedPrice);
          const overrideKey = `${mKey}::${dKey}::${sKey}`;
          if (!currentProductConfig.variantOverrides) currentProductConfig.variantOverrides = {};
          currentProductConfig.variantOverrides[overrideKey] = calculatedPrice;
        });
      });
    });

    // Master Size Addon edit (when grouped by size)
    document.querySelectorAll('.master-size-addon').forEach((input) => {
      input.addEventListener('change', () => {
        const sKey = input.getAttribute('data-size-key');
        const newAddon = parseCleanNumber(input.value);
        input.value = formatPriceValue(newAddon);

        if (currentProductConfig.sizes && currentProductConfig.sizes[sKey]) {
          currentProductConfig.sizes[sKey].addPrice = newAddon;
        }

        // Update child sub-inputs
        const childInputs = document.querySelectorAll(`.sub-variant-price[data-size-key="${sKey}"]`);
        childInputs.forEach((subInput) => {
          const mKey = subInput.getAttribute('data-metal-key');
          const dKey = subInput.getAttribute('data-diamond-key');
          const basePrice = currentProductConfig.metals?.[mKey]?.price ?? 260;
          const dAdd = currentProductConfig.diamonds?.[dKey]?.addPrice ?? 0;
          const calculatedPrice = basePrice + dAdd + newAddon;
          subInput.value = formatPriceValue(calculatedPrice);
          const overrideKey = `${mKey}::${dKey}::${sKey}`;
          if (!currentProductConfig.variantOverrides) currentProductConfig.variantOverrides = {};
          currentProductConfig.variantOverrides[overrideKey] = calculatedPrice;
        });
      });
    });

    // Sub-variant individual price input edit
    document.querySelectorAll('.sub-variant-price').forEach((input) => {
      input.addEventListener('change', () => {
        const overrideKey = input.getAttribute('data-override-key');
        const newPrice = parseCleanNumber(input.value);
        input.value = formatPriceValue(newPrice);
        if (!currentProductConfig.variantOverrides) {
          currentProductConfig.variantOverrides = {};
        }
        currentProductConfig.variantOverrides[overrideKey] = newPrice;
      });
    });
  }

  if (shopifyGroupBySelect) {
    shopifyGroupBySelect.addEventListener('change', () => {
      renderShopifyVariantsTable();
    });
  }

  // Toggle All Groups Open/Closed
  if (btnToggleAllGroups) {
    let allOpen = true;
    btnToggleAllGroups.addEventListener('click', () => {
      allOpen = !allOpen;
      document.querySelectorAll('.shopify-row-toggle-btn').forEach((btn) => {
        const groupId = btn.getAttribute('data-toggle');
        const childRows = document.querySelectorAll(`.child-of-${groupId}`);
        btn.classList.toggle('collapsed', !allOpen);
        childRows.forEach((row) => {
          row.style.display = allOpen ? 'table-row' : 'none';
        });
      });
    });
  }

  // Select All Checkbox
  if (selectAllVariantsCheckbox) {
    selectAllVariantsCheckbox.addEventListener('change', () => {
      const allCheckboxes = document.querySelectorAll('.shopify-variants-table .shopify-checkbox');
      allCheckboxes.forEach((cb) => {
        cb.checked = selectAllVariantsCheckbox.checked;
      });
    });
  }

  // Save Product & Variants Config Handler
  function saveShopifyProductChanges() {
    if (!currentProductConfig.variantOverrides) currentProductConfig.variantOverrides = {};

    // Metal alias map
    const aliases = {
      'Silver': ['White Gold', 'White'],
      '9K Gold': ['Yellow Gold'],
      '14K Gold': ['Rose Gold', 'Light Rose Gold'],
      '18K Gold': ['Dark Rose Gold', '18K Gold']
    };

    // Harvest sub-variant inputs
    document.querySelectorAll('.sub-variant-price').forEach((input) => {
      const mKey = input.getAttribute('data-metal-key');
      const dKey = input.getAttribute('data-diamond-key');
      const sKey = input.getAttribute('data-size-key');
      const val = parseCleanNumber(input.value);

      if (mKey && dKey && sKey) {
        const main3WayKey = `${mKey}::${dKey}::${sKey}`;
        currentProductConfig.variantOverrides[main3WayKey] = val;

        // Populate alias keys
        if (aliases[mKey]) {
          aliases[mKey].forEach((alias) => {
            currentProductConfig.variantOverrides[`${alias}::${dKey}::${sKey}`] = val;
          });
        }
      }
    });

    try {
      localStorage.setItem('dhouse_product_config', JSON.stringify(currentProductConfig));
      localStorage.setItem('dhouse_variant_prices', JSON.stringify(currentProductConfig.variantOverrides));
    } catch (e) {
      console.warn('Error saving product config to localStorage:', e);
    }

    if (productSaveAlert) {
      productSaveAlert.className = 'alert-box success';
      productSaveAlert.style.display = 'block';
      productSaveAlert.textContent = 'All variation prices saved successfully! Live storefront customizer is now updated.';
      setTimeout(() => {
        productSaveAlert.style.display = 'none';
      }, 4000);
    }
  }

  if (saveProductSettingsBtn) {
    saveProductSettingsBtn.addEventListener('click', saveShopifyProductChanges);
  }

  if (btnSaveVariantsTop) {
    btnSaveVariantsTop.addEventListener('click', saveShopifyProductChanges);
  }

  if (resetProductSettingsBtn) {
    resetProductSettingsBtn.addEventListener('click', () => {
      if (confirm('Reset all product variant prices and combinations to factory defaults?')) {
        localStorage.removeItem('dhouse_product_config');
        localStorage.removeItem('dhouse_variant_prices');
        currentProductConfig = JSON.parse(JSON.stringify(defaultProductConfig));
        renderShopifyVariantsTable();
        if (productSaveAlert) {
          productSaveAlert.className = 'alert-box success';
          productSaveAlert.style.display = 'block';
          productSaveAlert.textContent = 'Variants and rates reset to default values.';
          setTimeout(() => {
            productSaveAlert.style.display = 'none';
          }, 3500);
        }
      }
    });
  }

  if (btnAddVariantTop) {
    btnAddVariantTop.addEventListener('click', () => {
      const optionCategory = prompt('Which variation option would you like to add a new choice to?\nType 1 for Metal Selection, 2 for Diamond Selection, 3 for Diamond Size:', '1');
      if (optionCategory === '1') {
        const optName = prompt('Enter new Metal Option Name (e.g. Platinum 950, 24K Pure Gold):');
        if (optName && optName.trim()) {
          const name = optName.trim();
          const baseRate = prompt(`Enter starting base price for "${name}" ($):`, '950');
          const numRate = parseCleanNumber(baseRate || '950');
          if (!currentProductConfig.metals) currentProductConfig.metals = {};
          currentProductConfig.metals[name] = {
            price: numRate,
            purity: 'Bespoke Purity',
            colorName: name,
            swatch: '#94a3b8',
            img: 'images/wrist_silver.jpg',
            sku: 'LNK-CUST'
          };
          renderShopifyVariantsTable();
          saveShopifyProductChanges();
        }
      } else if (optionCategory === '2') {
        const optName = prompt('Enter new Diamond Selection Type (e.g. VVS Lab Diamond, Emerald Cut Moissanite):');
        if (optName && optName.trim()) {
          const name = optName.trim();
          const addRate = prompt(`Enter price add-on for "${name}" ($):`, '200');
          const numRate = parseCleanNumber(addRate || '200');
          if (!currentProductConfig.diamonds) currentProductConfig.diamonds = {};
          currentProductConfig.diamonds[name] = {
            addPrice: numRate,
            subtitle: 'Bespoke Diamond Selection'
          };
          renderShopifyVariantsTable();
          saveShopifyProductChanges();
        }
      } else if (optionCategory === '3') {
        const optName = prompt('Enter new Diamond Size (e.g. 5 mm, 2.5 mm):');
        if (optName && optName.trim()) {
          const name = optName.trim();
          const addRate = prompt(`Enter price add-on for size "${name}" ($):`, '50');
          const numRate = parseCleanNumber(addRate || '50');
          if (!currentProductConfig.sizes) currentProductConfig.sizes = {};
          currentProductConfig.sizes[name] = {
            addPrice: numRate
          };
          renderShopifyVariantsTable();
          saveShopifyProductChanges();
        }
      }
    });
  }

  if (btnAddOptionRow) {
    btnAddOptionRow.addEventListener('click', () => {
      const optName = prompt('Enter Option Name (e.g., Bracelet Length, Engraving):');
      if (optName && optName.trim()) {
        alert(`New Option "${optName.trim()}" added to product configuration!`);
      }
    });
  }

  function loadProductSettings() {
    currentProductConfig = getSavedProductConfig();
    renderShopifyVariantsTable();
  }

  // --------------------------------------------------------------------------
  // 3. Orders Management & Metrics
  // --------------------------------------------------------------------------
  const ordersTableBody = document.getElementById('ordersTableBody');
  const emptyOrdersState = document.getElementById('emptyOrdersState');
  const metricTotalRevenue = document.getElementById('metricTotalRevenue');
  const metricConfirmed = document.getElementById('metricConfirmed');
  const metricCrafting = document.getElementById('metricCrafting');
  const metricShipped = document.getElementById('metricShipped');
  const metricDelivered = document.getElementById('metricDelivered');
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
    return '$' + Math.max(0, Math.round(number)).toLocaleString('en-US');
  }

  function renderDashboard() {
    const orders = getOrders();
    const searchQuery = orderSearchInput ? orderSearchInput.value.toLowerCase().trim() : '';

    // Calculate metrics
    let totalRev = 0;
    let confirmedCount = 0;
    let craftingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;

    orders.forEach((o) => {
      // Clean numeric total
      const numTotal = parseInt(String(o.total || '0').replace(/[^0-9]/g, ''), 10) || 0;
      totalRev += numTotal;

      const st = (o.status || 'Confirmed').toLowerCase();
      if (st === 'confirmed') {
        confirmedCount++;
      } else if (st === 'crafting') {
        craftingCount++;
      } else if (st === 'shipped') {
        shippedCount++;
      } else if (st === 'delivered') {
        deliveredCount++;
      }
    });

    if (metricTotalRevenue) metricTotalRevenue.textContent = formatINR(totalRev);
    if (metricConfirmed) metricConfirmed.textContent = confirmedCount;
    if (metricCrafting) metricCrafting.textContent = craftingCount;
    if (metricShipped) metricShipped.textContent = shippedCount;
    if (metricDelivered) metricDelivered.textContent = deliveredCount;
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
            <td style="font-weight: 600; color: var(--text-heading);">${order.total || '$48,500'}</td>
            <td>
              <span class="payment-badge ${order.paymentMethod === 'cod' ? 'cod' : 'online'}">
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
