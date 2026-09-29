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

  // Current active gallery set (defaults to Silver)
  let currentMetal = 'Silver';
  let galleryImages = [...metalGallerySets['Silver']];
  let currentSlideIndex = 0;
  const totalSlides = galleryImages.length;

  const mainDisplayImg = document.getElementById('mainDisplayImg');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const indicatorFill = document.getElementById('indicatorFill');
  const thumbnailItems = document.querySelectorAll('.thumb-item');
  const specThumbImg = document.getElementById('specThumbImg');

  if (totalSlidesNum) totalSlidesNum.textContent = totalSlides;

  // ---------------------------------------------------------------------------
  // 2. Gallery Slider Controls
  // ---------------------------------------------------------------------------
  function updateGalleryDisplay(index, immediate = false) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlideIndex = index;

    if (immediate) {
      if (mainDisplayImg) mainDisplayImg.src = galleryImages[currentSlideIndex];
    } else {
      if (mainDisplayImg) {
        mainDisplayImg.style.opacity = '0.35';
        mainDisplayImg.style.transform = 'scale(0.98)';
        setTimeout(() => {
          mainDisplayImg.src = galleryImages[currentSlideIndex];
          mainDisplayImg.style.opacity = '1';
          mainDisplayImg.style.transform = 'scale(1)';
        }, 120);
      }
    }

    // Update Counter & Progress Bar
    if (currentSlideNum) currentSlideNum.textContent = currentSlideIndex + 1;
    if (indicatorFill) {
      const percentage = ((currentSlideIndex + 1) / totalSlides) * 100;
      indicatorFill.style.width = `${percentage}%`;
    }

    // Update Active Thumbnail Border
    thumbnailItems.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlideIndex);
    });
  }

  // Update gallery images and thumbnails when metal changes
  function updateMetalGallery(metalName) {
    if (!metalGallerySets[metalName]) return;
    currentMetal = metalName;
    galleryImages = [...metalGallerySets[metalName]];

    // Update thumbnail strip image sources
    galleryImages.forEach((imgSrc, i) => {
      const thumbImg = document.getElementById(`thumbImg${i}`);
      if (thumbImg) {
        thumbImg.src = imgSrc;
      }
    });

    // Update main display image
    updateGalleryDisplay(currentSlideIndex, false);

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
  });

  // ---------------------------------------------------------------------------
  // 3. Customizer State & Dynamic Pricing
  // ---------------------------------------------------------------------------
  const currentConfig = {
    metal: {
      name: 'Silver',
      purity: '92.5%',
      basePrice: 48500
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

  function formatINR(number) {
    return number.toLocaleString('en-IN');
  }

  function renderConfig() {
    const totalPrice =
      currentConfig.metal.basePrice +
      currentConfig.diamond.addPrice +
      currentConfig.size.addPrice;

    if (priceDisplay) {
      priceDisplay.textContent = formatINR(totalPrice);
    }

    if (specSummaryText) {
      specSummaryText.innerHTML = `Metal: ${currentConfig.metal.name} (${currentConfig.metal.purity}) &nbsp;|&nbsp; Color: ${currentConfig.color.name} &nbsp;|&nbsp; Diamond: ${currentConfig.diamond.type} &nbsp;|&nbsp; Size: ${currentConfig.size.value} &nbsp;|&nbsp; Certificate: ${currentConfig.certificate.code}`;
    }
  }

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
  const metalBars = document.querySelectorAll('#metalBarsGrid .ingot-card');
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

    // 2. Update ingot cards
    metalBars.forEach((bar) => {
      const isMatch = bar.getAttribute('data-metal') === metalName;
      bar.classList.toggle('active', isMatch);
    });

    // 3. Sync color selection
    if (syncColor && metalToColorMap[metalName]) {
      const targetColor = metalToColorMap[metalName];
      currentConfig.color.name = targetColor;
      colorCards.forEach((card) => {
        const isColorMatch = card.getAttribute('data-value') === targetColor;
        card.classList.toggle('active', isColorMatch);
        card.setAttribute('aria-selected', isColorMatch ? 'true' : 'false');
      });
    }

    // 4. Update Gallery Images for this Metal!
    updateMetalGallery(metalName);

    // 5. Re-render price & specs
    renderConfig();
  }

  // Click listeners for metal spheres
  metalSpheres.forEach((card) => {
    card.addEventListener('click', () => {
      selectMetal(card.getAttribute('data-value'));
    });
  });

  // Click listeners for metal ingot cards
  metalBars.forEach((bar) => {
    bar.addEventListener('click', () => {
      selectMetal(bar.getAttribute('data-metal'));
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

  // Add to Cart Interaction
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.transform = 'scale(1.35)';
        setTimeout(() => {
          cartBadge.style.transform = 'scale(1)';
        }, 200);
      }
      showToast(`Added to bag: Luster Bracelet (${currentConfig.metal.name}, ${currentConfig.diamond.type})`);
    });
  }

  // Wishlist Toggle (Synchronized between Navbar and Hero Image button)
  function toggleWishlist() {
    let isLiked = false;
    if (wishlistNavBtn) {
      wishlistNavBtn.classList.toggle('liked');
      isLiked = wishlistNavBtn.classList.contains('liked');
    }
    if (imageLikeBtn) {
      imageLikeBtn.classList.toggle('liked', isLiked);
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
      const phoneNumber = '919898948986';
      const text = encodeURIComponent(
        `Hi D'House Jewels! I would like to inquire about the Luster Bracelet:\n- Metal: ${currentConfig.metal.name} (${currentConfig.metal.purity})\n- Color: ${currentConfig.color.name}\n- Diamond: ${currentConfig.diamond.type}\n- Size: ${currentConfig.size.value}\n- Certificate: ${currentConfig.certificate.code}\n- Price: ₹${priceDisplay ? priceDisplay.textContent : '48,500'}`
      );
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
    });
  }

  // Initialize display
  updateMetalGallery('Silver');
  renderConfig();
});
