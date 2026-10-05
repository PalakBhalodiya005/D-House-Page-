/**
 * D'House Jewels - THE CLASS - Interactive Product Logic
 * Dynamic gallery images per metal selection (Silver, 9K Gold, 14K Gold, 18K Gold),
 * synchronized customizer options, dynamic pricing, cart, and WhatsApp inquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Metal Gallery Asset Definitions
  // ---------------------------------------------------------------------------
  const metalGallerySets = {
    'Silver': [
      'images/wrist_silver.jpg',
      'images/angled_silver.jpg',
      'images/circle_silver.jpg',
      'images/thumb4.jpg',
      'images/straight_silver.jpg'
    ],
    '9K Gold': [
      'images/wrist_9k.jpg',
      'images/angled_9k.jpg',
      'images/circle_9k.jpg',
      'images/thumb4.jpg',
      'images/straight_9k.jpg'
    ],
    '14K Gold': [
      'images/wrist_14k.jpg',
      'images/angled_14k.jpg',
      'images/circle_14k.jpg',
      'images/thumb4.jpg',
      'images/straight_14k.jpg'
    ],
    '18K Gold': [
      'images/wrist_18k.jpg',
      'images/angled_18k.jpg',
      'images/circle_18k.jpg',
      'images/thumb4.jpg',
      'images/straight_18k.jpg'
    ]
  };

  const metalConfigThumbs = {
    'Silver': 'images/circle_silver.jpg',
    '9K Gold': 'images/circle_9k.jpg',
    '14K Gold': 'images/circle_14k.jpg',
    '18K Gold': 'images/circle_18k.jpg'
  };

  // Metal to Color mapping
  const metalToColorMap = {
    'Silver': 'White',
    '9K Gold': 'Yellow Gold',
    '14K Gold': 'Light Rose Gold',
    '18K Gold': 'Dark Rose Gold'
  };

  // Color to Metal mapping
  const colorToMetalMap = {
    'White': 'Silver',
    'Yellow Gold': '9K Gold',
    'Light Rose Gold': '14K Gold',
    'Dark Rose Gold': '18K Gold'
  };

  // ---------------------------------------------------------------------------
  // Product Showcase Videos (M1.mp4 to M8.mp4) - Voice Muted
  // ---------------------------------------------------------------------------
  const CDN_BASE = 'https://palakbhalodiya005.github.io/d-house-video';

  const productVideos = [
    `${CDN_BASE}/M1.mp4`,
    `${CDN_BASE}/M2.mp4`,
    `${CDN_BASE}/M3.mp4`,
    `${CDN_BASE}/M4.mp4`,
    `${CDN_BASE}/M5.mp4`,
    `${CDN_BASE}/M6.mp4`,
    `${CDN_BASE}/M7.mp4`,
    `${CDN_BASE}/M8.mp4`
  ];

  let currentMetal = 'Silver';
  let currentSlideIndex = 0;
  const totalSlides = productVideos.length;

  const mainDisplayVideo = document.getElementById('mainDisplayVideo');
  const mainDisplayImg = document.getElementById('mainDisplayImg');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const indicatorFill = document.getElementById('indicatorFill');
  const thumbnailItems = document.querySelectorAll('.thumb-item');
  const specThumbImg = document.getElementById('specThumbImg');

  if (totalSlidesNum) totalSlidesNum.textContent = totalSlides;

  // Ensure main video is strictly muted (voice muted as requested)
  if (mainDisplayVideo) {
    mainDisplayVideo.muted = true;
    mainDisplayVideo.defaultMuted = true;
    mainDisplayVideo.volume = 0;
  }

  // ---------------------------------------------------------------------------
  // 2. Gallery Video Slider Controls (Voice Muted)
  // ---------------------------------------------------------------------------
  function updateGalleryDisplay(index, immediate = false) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlideIndex = index;
    const targetVideoSrc = productVideos[currentSlideIndex];

    if (mainDisplayVideo) {
      if (immediate) {
        if (!mainDisplayVideo.src.endsWith(targetVideoSrc)) {
          mainDisplayVideo.src = targetVideoSrc;
        }
        mainDisplayVideo.muted = true;
        mainDisplayVideo.defaultMuted = true;
        mainDisplayVideo.volume = 0;
        mainDisplayVideo.currentTime = 0;
        const playPromise = mainDisplayVideo.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
      } else {
        mainDisplayVideo.style.opacity = '0.35';
        mainDisplayVideo.style.transform = 'scale(0.98)';
        setTimeout(() => {
          mainDisplayVideo.src = targetVideoSrc;
          mainDisplayVideo.muted = true;
          mainDisplayVideo.defaultMuted = true;
          mainDisplayVideo.volume = 0;
          mainDisplayVideo.currentTime = 0;
          const playPromise = mainDisplayVideo.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
          mainDisplayVideo.style.opacity = '1';
          mainDisplayVideo.style.transform = 'scale(1)';
        }, 120);
      }
    } else if (mainDisplayImg) {
      mainDisplayImg.src = targetVideoSrc;
    }

    // Update Counter & Progress Bar
    if (currentSlideNum) currentSlideNum.textContent = currentSlideIndex + 1;
    if (indicatorFill) {
      const percentage = ((currentSlideIndex + 1) / totalSlides) * 100;
      indicatorFill.style.width = `${percentage}%`;
    }

    // Update Active Thumbnail Border & scroll into view on mobile
    thumbnailItems.forEach((thumb, i) => {
      const isActive = i === currentSlideIndex;
      thumb.classList.toggle('active', isActive);
      if (isActive && thumb.scrollIntoView && window.innerWidth <= 600) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Prefetch next video in background for instant next-slide transition
    const nextIdx = (currentSlideIndex + 1) % totalSlides;
    const nextVideoSrc = productVideos[nextIdx];
    if (!document.querySelector(`link[href="${nextVideoSrc}"]`)) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'video';
      link.href = nextVideoSrc;
      document.head.appendChild(link);
    }
  }

  // Update gallery images and thumbnails when metal changes
  function updateMetalGallery(metalName) {
    currentMetal = metalName;

    // Update config spec pill thumbnail
    if (specThumbImg && metalConfigThumbs[metalName]) {
      specThumbImg.src = metalConfigThumbs[metalName];
    }
  }

  // Gallery Navigation Buttons
  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGalleryDisplay(currentSlideIndex - 1);
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGalleryDisplay(currentSlideIndex + 1);
    });
  }

  thumbnailItems.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.getAttribute('data-index'), 10);
      updateGalleryDisplay(index);
    });

    // Silent preview on thumbnail hover for desktop
    thumb.addEventListener('mouseenter', () => {
      const v = thumb.querySelector('.thumb-video');
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
        v.volume = 0;
        v.currentTime = 0;
        const p = v.play();
        if (p !== undefined) p.catch(() => {});
      }
    });

    thumb.addEventListener('mouseleave', () => {
      const v = thumb.querySelector('.thumb-video');
      if (v) {
        v.pause();
        v.currentTime = 0.1;
      }
    });
  });

  // Ensure all thumbnail videos are strictly muted & paint preview frame
  document.querySelectorAll('.thumb-video').forEach((v) => {
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    const paintFrame = () => {
      try {
        v.currentTime = 0.1;
      } catch (err) {}
    };
    if (v.readyState >= 1) {
      paintFrame();
    } else {
      v.addEventListener('loadedmetadata', paintFrame, { once: true });
    }
  });

  // Main video click to pause/play (always strictly muted)
  if (mainDisplayVideo) {
    mainDisplayVideo.addEventListener('click', () => {
      if (mainDisplayVideo.paused) {
        mainDisplayVideo.muted = true;
        mainDisplayVideo.volume = 0;
        mainDisplayVideo.play().catch(() => {});
      } else {
        mainDisplayVideo.pause();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Customizer State & Dynamic Pricing
  // ---------------------------------------------------------------------------
  const FIXED_VARIANT_PRICES = {
    // Silver / White Gold / White
    'Silver::Moissanite::2 mm': 260,
    'Silver::Moissanite::3 mm': 270,
    'Silver::Moissanite::4 mm': 280,
    'Silver::CVD::2 mm': 1380,
    'Silver::CVD::3 mm': 1480,
    'Silver::CVD::4 mm': 1580,
    'Silver::Natural::2 mm': 6680,
    'Silver::Natural::3 mm': 6980,
    'Silver::Natural::4 mm': 7280,
    'White Gold::Moissanite::2 mm': 260,
    'White Gold::Moissanite::3 mm': 270,
    'White Gold::Moissanite::4 mm': 280,
    'White Gold::CVD::2 mm': 1380,
    'White Gold::CVD::3 mm': 1480,
    'White Gold::CVD::4 mm': 1580,
    'White Gold::Natural::2 mm': 6680,
    'White Gold::Natural::3 mm': 6980,
    'White Gold::Natural::4 mm': 7280,
    'White::Moissanite::2 mm': 260,
    'White::Moissanite::3 mm': 270,
    'White::Moissanite::4 mm': 280,
    'White::CVD::2 mm': 1380,
    'White::CVD::3 mm': 1480,
    'White::CVD::4 mm': 1580,
    'White::Natural::2 mm': 6680,
    'White::Natural::3 mm': 6980,
    'White::Natural::4 mm': 7280,

    // 9K Gold / Yellow Gold (Admin Panel Variations)
    '9K Gold::Moissanite::2 mm': 1150,
    '9K Gold::Moissanite::3 mm': 1160,
    '9K Gold::Moissanite::4 mm': 1170,
    '9K Gold::CVD::2 mm': 2270,
    '9K Gold::CVD::3 mm': 2370,
    '9K Gold::CVD::4 mm': 2470,
    '9K Gold::Natural::2 mm': 7840,
    '9K Gold::Natural::3 mm': 8140,
    '9K Gold::Natural::4 mm': 8440,
    'Yellow Gold::Moissanite::2 mm': 1150,
    'Yellow Gold::Moissanite::3 mm': 1160,
    'Yellow Gold::Moissanite::4 mm': 1170,
    'Yellow Gold::CVD::2 mm': 2270,
    'Yellow Gold::CVD::3 mm': 2370,
    'Yellow Gold::CVD::4 mm': 2470,
    'Yellow Gold::Natural::2 mm': 7840,
    'Yellow Gold::Natural::3 mm': 8140,
    'Yellow Gold::Natural::4 mm': 8440,

    // 14K Gold / Rose Gold / Light Rose Gold
    '14K Gold::Moissanite::2 mm': 1650,
    '14K Gold::Moissanite::3 mm': 1660,
    '14K Gold::Moissanite::4 mm': 1670,
    '14K Gold::CVD::2 mm': 2770,
    '14K Gold::CVD::3 mm': 2870,
    '14K Gold::CVD::4 mm': 2970,
    '14K Gold::Natural::2 mm': 8340,
    '14K Gold::Natural::3 mm': 8640,
    '14K Gold::Natural::4 mm': 8940,
    'Rose Gold::Moissanite::2 mm': 1650,
    'Rose Gold::Moissanite::3 mm': 1660,
    'Rose Gold::Moissanite::4 mm': 1670,
    'Rose Gold::CVD::2 mm': 2770,
    'Rose Gold::CVD::3 mm': 2870,
    'Rose Gold::CVD::4 mm': 2970,
    'Rose Gold::Natural::2 mm': 8340,
    'Rose Gold::Natural::3 mm': 8640,
    'Rose Gold::Natural::4 mm': 8940,
    'Light Rose Gold::Moissanite::2 mm': 1650,
    'Light Rose Gold::Moissanite::3 mm': 1660,
    'Light Rose Gold::Moissanite::4 mm': 1670,
    'Light Rose Gold::CVD::2 mm': 2770,
    'Light Rose Gold::CVD::3 mm': 2870,
    'Light Rose Gold::CVD::4 mm': 2970,
    'Light Rose Gold::Natural::2 mm': 8340,
    'Light Rose Gold::Natural::3 mm': 8640,
    'Light Rose Gold::Natural::4 mm': 8940,

    // 18K Gold / Dark Rose Gold
    '18K Gold::Moissanite::2 mm': 2050,
    '18K Gold::Moissanite::3 mm': 2060,
    '18K Gold::Moissanite::4 mm': 2070,
    '18K Gold::CVD::2 mm': 3170,
    '18K Gold::CVD::3 mm': 3270,
    '18K Gold::CVD::4 mm': 3370,
    '18K Gold::Natural::2 mm': 8740,
    '18K Gold::Natural::3 mm': 9040,
    '18K Gold::Natural::4 mm': 9340,
    'Dark Rose Gold::Moissanite::2 mm': 2050,
    'Dark Rose Gold::Moissanite::3 mm': 2060,
    'Dark Rose Gold::Moissanite::4 mm': 2070,
    'Dark Rose Gold::CVD::2 mm': 3170,
    'Dark Rose Gold::CVD::3 mm': 3270,
    'Dark Rose Gold::CVD::4 mm': 3370,
    'Dark Rose Gold::Natural::2 mm': 8740,
    'Dark Rose Gold::Natural::3 mm': 9040,
    'Dark Rose Gold::Natural::4 mm': 9340
  };

  const currentConfig = {
    metal: {
      name: 'Silver',
      purity: '92.5%',
      basePrice: 260
    },
    braceletSize: {
      value: '7” (17.8 cm)',
      addPrice: 0
    },
    diamond: {
      type: 'Moissanite',
      addPrice: 0
    },
    size: {
      value: '3 mm',
      addPrice: 0
    },
    color: {
      name: 'White'
    },
    certificate: {
      code: 'HRD',
      name: 'HRD Antwerp'
    }
  };

  const priceDisplay = document.getElementById('priceDisplay');
  const specSummaryText = document.getElementById('specSummaryText');

  function parseCleanPrice(val) {
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

  function formatINR(number) {
    return Math.max(0, Math.round(number)).toLocaleString('en-US');
  }

  function isCorruptedStalePrice(key, price) {
    if (!price || price <= 0) return true;
    const num = Number(price);
    // 9K Gold variants: Moissanite is 1150+, CVD is 2270+, Natural is 7840+
    if (key.includes('9K Gold') || key.includes('Yellow Gold')) {
      if (key.includes('Moissanite') && num < 1100) return true;
      if (key.includes('CVD') && num < 2200) return true;
      if (key.includes('Natural') && num < 7800) return true;
    }
    // Silver variants: CVD >= 1300, Natural >= 6500
    if (key.includes('Silver') || key.includes('White')) {
      if (key.includes('CVD') && num < 1300) return true;
      if (key.includes('Natural') && num < 6500) return true;
    }
    // 14K Gold variants: Moissanite >= 1600, CVD >= 2700, Natural >= 8300
    if (key.includes('14K Gold') || key.includes('Rose Gold')) {
      if (key.includes('Moissanite') && num < 1600) return true;
      if (key.includes('CVD') && num < 2700) return true;
      if (key.includes('Natural') && num < 8300) return true;
    }
    // 18K Gold variants: Moissanite >= 2000, CVD >= 3100, Natural >= 8700
    if (key.includes('18K Gold') || key.includes('Dark Rose Gold')) {
      if (key.includes('Moissanite') && num < 2000) return true;
      if (key.includes('CVD') && num < 3100) return true;
      if (key.includes('Natural') && num < 8700) return true;
    }
    return false;
  }

  function sanitizeLocalStoragePricing() {
    try {
      const raw = localStorage.getItem('dhouse_product_config');
      if (raw) {
        const pConfig = JSON.parse(raw);
        let changed = false;
        if (pConfig.variantOverrides) {
          for (const key in FIXED_VARIANT_PRICES) {
            const currentVal = pConfig.variantOverrides[key];
            if (currentVal === undefined || isCorruptedStalePrice(key, currentVal)) {
              pConfig.variantOverrides[key] = FIXED_VARIANT_PRICES[key];
              changed = true;
            }
          }
        } else {
          pConfig.variantOverrides = Object.assign({}, FIXED_VARIANT_PRICES);
          changed = true;
        }
        if (changed) {
          localStorage.setItem('dhouse_product_config', JSON.stringify(pConfig));
          localStorage.setItem('dhouse_variant_prices', JSON.stringify(pConfig.variantOverrides));
        }
      }

      const rawVar = localStorage.getItem('dhouse_variant_prices');
      if (rawVar) {
        const varPrices = JSON.parse(rawVar);
        let changedVar = false;
        for (const key in FIXED_VARIANT_PRICES) {
          const currentVal = varPrices[key];
          if (currentVal === undefined || isCorruptedStalePrice(key, currentVal)) {
            varPrices[key] = FIXED_VARIANT_PRICES[key];
            changedVar = true;
          }
        }
        if (changedVar) {
          localStorage.setItem('dhouse_variant_prices', JSON.stringify(varPrices));
        }
      }
    } catch (e) {
      console.warn('Error sanitizing local storage pricing:', e);
    }
  }

  function getCurrentTotalPrice() {
    let finalPrice = null;
    const mName = currentConfig.metal.name;
    const dType = currentConfig.diamond.type;
    const sVal = currentConfig.size.value;
    const cName = currentConfig.color.name;

    const possible3WayKeys = [
      `${mName}::${dType}::${sVal}`,
      `${cName}::${dType}::${sVal}`,
      mName === 'Silver' ? `White Gold::${dType}::${sVal}` : '',
      mName === 'Silver' ? `White::${dType}::${sVal}` : '',
      mName === '9K Gold' ? `Yellow Gold::${dType}::${sVal}` : '',
      mName === '14K Gold' ? `Rose Gold::${dType}::${sVal}` : '',
      mName === '14K Gold' ? `Light Rose Gold::${dType}::${sVal}` : '',
      mName === '18K Gold' ? `Dark Rose Gold::${dType}::${sVal}` : '',
      cName === 'White' ? `Silver::${dType}::${sVal}` : '',
      cName === 'White' ? `White Gold::${dType}::${sVal}` : '',
      cName === 'Yellow Gold' ? `9K Gold::${dType}::${sVal}` : '',
      cName === 'Rose Gold' ? `14K Gold::${dType}::${sVal}` : '',
      cName === 'Light Rose Gold' ? `14K Gold::${dType}::${sVal}` : '',
      cName === 'Dark Rose Gold' ? `18K Gold::${dType}::${sVal}` : ''
    ].filter(Boolean);

    // 1. Check custom overrides from localStorage if present
    try {
      const raw = localStorage.getItem('dhouse_product_config');
      if (raw) {
        const pConfig = JSON.parse(raw);
        if (pConfig.metals && pConfig.metals.Silver && pConfig.metals.Silver.price > 5000) {
          localStorage.removeItem('dhouse_product_config');
          localStorage.removeItem('dhouse_variant_prices');
        } else if (pConfig.variantOverrides) {
          for (const key of possible3WayKeys) {
            if (pConfig.variantOverrides[key] !== undefined && pConfig.variantOverrides[key] !== null) {
              const parsed = parseCleanPrice(pConfig.variantOverrides[key]);
              if (parsed > 0 && !isCorruptedStalePrice(key, parsed)) {
                finalPrice = parsed;
                break;
              }
            }
          }
        }
      }
      if (finalPrice === null) {
        const rawVar = localStorage.getItem('dhouse_variant_prices');
        if (rawVar) {
          const varPrices = JSON.parse(rawVar);
          for (const key of possible3WayKeys) {
            if (varPrices[key] !== undefined && varPrices[key] !== null) {
              const parsed = parseCleanPrice(varPrices[key]);
              if (parsed > 0 && !isCorruptedStalePrice(key, parsed)) {
                finalPrice = parsed;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error reading variant overrides from localStorage:', e);
    }

    // 2. Lookup embedded fixed price table (exact match from Admin Panel)
    if (finalPrice === null) {
      for (const key of possible3WayKeys) {
        if (FIXED_VARIANT_PRICES[key] !== undefined) {
          finalPrice = FIXED_VARIANT_PRICES[key];
          break;
        }
      }
    }

    // 3. Fallback to basic formula if custom variant not in matrix
    if (finalPrice === null) {
      finalPrice = (currentConfig.metal.basePrice || 260) + (currentConfig.diamond.addPrice || 0) + (currentConfig.size.addPrice || 0);
    }

    // No price variation for Available Sizes (bracelet length) - size changes do not affect price
    return finalPrice;
  }

  function renderConfig() {
    const totalPrice = getCurrentTotalPrice();

    if (priceDisplay) {
      priceDisplay.textContent = formatINR(totalPrice);
      priceDisplay.classList.remove('price-update-pop');
      void priceDisplay.offsetWidth; // Force DOM reflow to retrigger animation
      priceDisplay.classList.add('price-update-pop');
    }

    if (specSummaryText) {
      specSummaryText.innerHTML = `Metal: ${currentConfig.metal.name} (${currentConfig.metal.purity}) &nbsp;|&nbsp; Bracelet Size: ${currentConfig.braceletSize.value} &nbsp;|&nbsp; Color: ${currentConfig.color.name} &nbsp;|&nbsp; Diamond: ${currentConfig.diamond.type} &nbsp;|&nbsp; Diamond Size: ${currentConfig.size.value} &nbsp;|&nbsp; Certificate: ${currentConfig.certificate.code}`;
    }
  }

  // Load Admin-Configured Product Rates & Details
  function applyAdminProductConfig() {
    try {
      const raw = localStorage.getItem('dhouse_product_config');
      if (!raw) return;
      const config = JSON.parse(raw);

      // Update Titles
      if (config.title) {
        document.querySelectorAll('.product-title').forEach((el) => {
          el.textContent = config.title;
        });
      }
      if (config.tagline) {
        document.querySelectorAll('.description-tagline').forEach((el) => {
          el.textContent = config.tagline;
        });
      }

      // Update Metal Cards (base price and purity)
      if (config.metals) {
        document.querySelectorAll('#metalSpheresGrid .choice-card').forEach((card) => {
          const val = card.getAttribute('data-value');
          if (config.metals[val]) {
            const m = config.metals[val];
            if (m.price !== undefined) card.setAttribute('data-price', m.price);
            if (m.purity) {
              card.setAttribute('data-purity', m.purity);
              const detailSpan = card.querySelector('.card-detail span:first-child');
              if (detailSpan) detailSpan.textContent = m.purity;
            }
          }
        });
      }

      // Update Diamond Cards (addPrice and subtitle)
      if (config.diamonds) {
        document.querySelectorAll('#diamondGrid .choice-card').forEach((card) => {
          const val = card.getAttribute('data-value');
          if (config.diamonds[val]) {
            const d = config.diamonds[val];
            if (d.addPrice !== undefined) card.setAttribute('data-addprice', d.addPrice);
            if (d.subtitle) {
              const subSpan = card.querySelector('.card-detail span:first-child');
              if (subSpan) subSpan.textContent = d.subtitle;
            }
          }
        });
      }

      // Update Diamond Size Cards (addPrice)
      if (config.sizes) {
        document.querySelectorAll('#sizeGrid .choice-card').forEach((card) => {
          const val = card.getAttribute('data-value');
          if (config.sizes[val] && config.sizes[val].addPrice !== undefined) {
            card.setAttribute('data-addprice', config.sizes[val].addPrice);
          }
        });
      }

      // Synchronize currentConfig with active DOM cards
      const activeMetalCard = document.querySelector('#metalSpheresGrid .choice-card.active');
      if (activeMetalCard) {
        currentConfig.metal.name = activeMetalCard.getAttribute('data-value') || 'Silver';
        currentConfig.metal.purity = activeMetalCard.getAttribute('data-purity') || '92.5%';
        currentConfig.metal.basePrice = parseCleanPrice(activeMetalCard.getAttribute('data-price') || '260');
      }

      const activeDiamondCard = document.querySelector('#diamondGrid .choice-card.active');
      if (activeDiamondCard) {
        currentConfig.diamond.type = activeDiamondCard.getAttribute('data-value') || 'Moissanite';
        currentConfig.diamond.addPrice = parseCleanPrice(activeDiamondCard.getAttribute('data-addprice') || '0');
      }

      const activeSizeCard = document.querySelector('#sizeGrid .choice-card.active');
      if (activeSizeCard) {
        currentConfig.size.value = activeSizeCard.getAttribute('data-value') || '3 mm';
        currentConfig.size.addPrice = parseCleanPrice(activeSizeCard.getAttribute('data-addprice') || '0');
      }
    } catch (e) {
      console.warn('Error applying admin product configuration:', e);
    }
  }

  // Sanitize and apply admin rates immediately
  sanitizeLocalStoragePricing();
  applyAdminProductConfig();
  renderConfig();

  // Real-time synchronization when variation prices are saved in Admin Panel
  window.addEventListener('storage', (e) => {
    if (e.key === 'dhouse_product_config' || e.key === 'dhouse_variant_prices') {
      sanitizeLocalStoragePricing();
      applyAdminProductConfig();
      renderConfig();
    }
  });

  // Generic card group selection helper
  function setupSelectionGroup(containerSelector, onSelect) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = container.querySelectorAll('.choice-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
        onSelect(card);
        renderConfig();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Synchronized Metal & Color Selection
  // ---------------------------------------------------------------------------
  const metalSpheres = document.querySelectorAll('#metalSpheresGrid .choice-card');
  const colorCards = document.querySelectorAll('#colorGrid .choice-card');

  function selectMetal(metalName, syncColor = true) {
    // 1. Update sphere cards
    metalSpheres.forEach((card) => {
      const isMatch = card.getAttribute('data-value') === metalName;
      card.classList.toggle('active', isMatch);
      card.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      if (isMatch) {
        currentConfig.metal.name = card.getAttribute('data-value');
        currentConfig.metal.purity = card.getAttribute('data-purity');
        currentConfig.metal.basePrice = parseInt(card.getAttribute('data-price'), 10);
      }
    });

    // 2. Sync color selection
    if (syncColor && metalToColorMap[metalName]) {
      const targetColor = metalToColorMap[metalName];
      currentConfig.color.name = targetColor;
      colorCards.forEach((card) => {
        const isColorMatch = card.getAttribute('data-value') === targetColor;
        card.classList.toggle('active', isColorMatch);
        card.setAttribute('aria-selected', isColorMatch ? 'true' : 'false');
      });
    }

    // 3. Update Gallery Images for this Metal!
    updateMetalGallery(metalName);

    // 4. Re-render price & specs
    renderConfig();
  }

  // Click listeners for metal spheres
  metalSpheres.forEach((card) => {
    card.addEventListener('click', () => {
      selectMetal(card.getAttribute('data-value'));
    });
  });

  // Click listeners for color cards (syncs metal)
  colorCards.forEach((card) => {
    card.addEventListener('click', () => {
      colorCards.forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-selected', 'true');

      const colorValue = card.getAttribute('data-value');
      currentConfig.color.name = colorValue;

      // Sync corresponding metal and gallery images
      if (colorToMetalMap[colorValue]) {
        selectMetal(colorToMetalMap[colorValue], false);
      } else {
        renderConfig();
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Luxury Bracelet Size Dropdown Handler & Dynamic Price Update
  // ---------------------------------------------------------------------------
  const braceletSizeDropdown = document.getElementById('braceletSizeDropdown');
  const sizeDropdownTrigger = document.getElementById('sizeDropdownTrigger');
  const sizeDropdownMenu = document.getElementById('sizeDropdownMenu');
  const triggerSizeBadge = document.getElementById('triggerSizeBadge');
  const triggerSelectedText = document.getElementById('triggerSelectedText');

  if (sizeDropdownTrigger && braceletSizeDropdown) {
    // Toggle dropdown
    sizeDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = braceletSizeDropdown.classList.toggle('open');
      sizeDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!braceletSizeDropdown.contains(e.target)) {
        braceletSizeDropdown.classList.remove('open');
        sizeDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && braceletSizeDropdown.classList.contains('open')) {
        braceletSizeDropdown.classList.remove('open');
        sizeDropdownTrigger.setAttribute('aria-expanded', 'false');
        sizeDropdownTrigger.focus();
      }
    });

    // Option item click
    const dropdownItems = braceletSizeDropdown.querySelectorAll('.luxury-dropdown-item');
    dropdownItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownItems.forEach((it) => {
          it.classList.remove('active');
          it.setAttribute('aria-selected', 'false');
        });
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');

        const val = item.getAttribute('data-value');
        const size = item.getAttribute('data-size');

        // Update trigger UI
        if (triggerSizeBadge) triggerSizeBadge.textContent = size;
        if (triggerSelectedText) triggerSelectedText.textContent = val;

        // Update config state with size (no price variation for bracelet size)
        currentConfig.braceletSize.value = val;
        currentConfig.braceletSize.addPrice = 0;

        // Close dropdown
        braceletSizeDropdown.classList.remove('open');
        sizeDropdownTrigger.setAttribute('aria-expanded', 'false');

        // Immediately update main price tag and specs display
        renderConfig();
      });
    });
  }

  // Diamond Type Selection Handler
  setupSelectionGroup('#diamondGrid', (card) => {
    currentConfig.diamond.type = card.getAttribute('data-value');
    currentConfig.diamond.addPrice = parseInt(card.getAttribute('data-addprice'), 10);
  });

  // Diamond Size Selection Handler
  setupSelectionGroup('#sizeGrid', (card) => {
    currentConfig.size.value = card.getAttribute('data-value');
    currentConfig.size.addPrice = parseInt(card.getAttribute('data-addprice'), 10);
  });

  // Certificate Selection Handler
  setupSelectionGroup('#certGrid', (card) => {
    currentConfig.certificate.code = card.getAttribute('data-value');
    currentConfig.certificate.name = card.getAttribute('data-certname');
  });

  // ---------------------------------------------------------------------------
  // 5. Actions: Cart, Wishlist, WhatsApp & Toast
  // ---------------------------------------------------------------------------
  let cartCount = 0;
  const cartBadge = document.getElementById('cartBadge');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const wishlistNavBtn = document.getElementById('wishlistNavBtn');
  const imageLikeBtn = document.getElementById('imageLikeBtn');

  function showToast(message) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // Helper to save current configuration & directly open checkout page
  function saveAndDirectCheckout() {
    const totalPrice = getCurrentTotalPrice();

    const selectedImg = metalConfigThumbs[currentMetal] || 'images/circle_silver.jpg';

    const checkoutItem = {
      title: 'Luster Bracelet',
      metal: currentConfig.metal.name,
      purity: currentConfig.metal.purity,
      color: currentConfig.color.name,
      braceletSize: currentConfig.braceletSize.value,
      diamond: currentConfig.diamond.type,
      size: currentConfig.size.value,
      certificate: currentConfig.certificate.code,
      certificateName: currentConfig.certificate.name,
      price: totalPrice,
      image: selectedImg,
      quantity: 1
    };

    try {
      localStorage.setItem('dhouse_checkout_item', JSON.stringify(checkoutItem));
    } catch (e) {
      console.warn('Could not save checkout item to localStorage', e);
    }

    // Direct redirect to checkout page
    window.location.href = 'checkout.html';
  }

  // Add to Cart Interaction - directly opens checkout page
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.transform = 'scale(1.35)';
      }
      saveAndDirectCheckout();
    });
  }

  // Header Cart Icon Navigation
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      saveAndDirectCheckout();
    });
  }

  // Wishlist Toggle (Hero Image button & Navbar if present)
  function toggleWishlist() {
    if (!imageLikeBtn) return;
    const isLiked = imageLikeBtn.classList.toggle('liked');
    if (wishlistNavBtn) {
      wishlistNavBtn.classList.toggle('liked', isLiked);
    }
    showToast(isLiked ? 'Added to your Wishlist' : 'Removed from Wishlist');
  }

  if (wishlistNavBtn) {
    wishlistNavBtn.addEventListener('click', toggleWishlist);
  }

  if (imageLikeBtn) {
    imageLikeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist();
    });
  }

  // Chat on WhatsApp with pre-filled message
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const savedWa = localStorage.getItem('dhouse_whatsapp_number');
      const phoneNumber = (savedWa && savedWa.trim()) ? savedWa.trim().replace(/[^0-9]/g, '') : '919898948986';
      const text = encodeURIComponent(
        `Hi D'House Jewels! I would like to inquire about the Luster Bracelet:\n- Metal: ${currentConfig.metal.name} (${currentConfig.metal.purity})\n- Bracelet Size: ${currentConfig.braceletSize.value}\n- Color: ${currentConfig.color.name}\n- Diamond: ${currentConfig.diamond.type}\n- Diamond Size: ${currentConfig.size.value}\n- Certificate: ${currentConfig.certificate.code}\n- Price: $${priceDisplay ? priceDisplay.textContent : '260'}`
      );
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber || '919898948986'}&text=${text}`, '_blank');
    });
  }

  // Initialize display
  updateMetalGallery('Silver');
  updateGalleryDisplay(0, true);
  renderConfig();
});
