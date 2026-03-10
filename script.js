/**
 * MapúaWhere — Client-Side Logic
 * Author : [Your Name]
 * Course : ITS121 Web Systems and Technologies
 * Purpose: Handles UI interactions, client-side validation,
 *          data loading from the Express API, and DOM updates
 *          for all pages (index, gallery, details, forms).
 * ─────────────────────────────────────────────────────────────
 */

/* ============================================================
<<<<<<< Updated upstream
<<<<<<< Updated upstream
   SECTION 0: PROTOTYPE DATA
   Contribution: [Your Name]
   Hardcoded demo items used when the backend API is offline.
   Image filenames match exactly what is in public/uploads/.
=======
   PROTOTYPE DATA
>>>>>>> Stashed changes
=======
   PROTOTYPE DATA
>>>>>>> Stashed changes
   ============================================================ */

const PROTOTYPE_ITEMS = [
  {
    id: 1,
    category: 'Clothing/Accessories',
    itemName: 'Totoro Pouch',
    location: '2nd Floor Bathroom',
    description: 'Totoro Pouch with mini cabbage and star keychain on it and coins inside.',
    status: 'resolved',
    contact: 'Honey Lee',        // Found By
    phone: '0123456798',
    returnedTo: 'Janina Yu',
    returnedToPhone: '0163456789',
    image: 'uploads/Totoro_Pouch.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '3/9/2026, 2:30pm',
  },
  {
    id: 2,
    category: 'Clothing/Accessories',
    itemName: 'Bracelet',
    location: '2nd Floor Bathroom',
    description: 'Beaded bracelet with blue beads and white beads with black star on it.',
    status: 'found',
    contact: 'Janina Yu',
    phone: '0163456789',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    image: '/uploads/Bracelet.jpg',
    timestamp: '3/9/2026, 2:30pm',
=======
    image: 'uploads/Bracelet.jpg',
>>>>>>> Stashed changes
=======
    image: 'uploads/Bracelet.jpg',
>>>>>>> Stashed changes
    displayTime: '3/9/2026, 2:30pm',
  },
  {
    id: 3,
    category: 'Wallets/Keys/IDs',
    itemName: 'Keys',
    location: 'Back Entrance',
    description: '3 keys, one black and two plain silver, it has a kraftvear & n1 keychain and a self defense alarm.',
    status: 'found',
    contact: 'Alaina Kim',
    phone: '0173456789',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    image: '/uploads/Keys.jpg',
    timestamp: '3/9/2026, 2:30pm',
=======
    image: 'uploads/Keys.jpg',
>>>>>>> Stashed changes
=======
    image: 'uploads/Keys.jpg',
>>>>>>> Stashed changes
    displayTime: '3/9/2026, 2:30pm',
  },
  {
    id: 4,
    category: 'Electronics',
    itemName: 'Airpods',
    location: 'Ground Floor Bathroom',
    description: 'Pink Airpods pro with black lace to use it as a keychain.',
    status: 'lost',
    contact: 'Honey Lee',
    phone: '0123456798',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    image: '/uploads/Aipods.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '32 Mins Ago',   // shown in Recent Activity
=======
=======
>>>>>>> Stashed changes
    image: 'uploads/Aipods.jpg',
    displayTime: '32 Mins Ago',
>>>>>>> Stashed changes
  },
  {
    id: 5,
    category: 'Electronics',
    itemName: 'Charging Cable',
    location: 'Cafeteria',
    description: 'White iphone charger with clear cover that has silver ribbon design.',
    status: 'lost',
    contact: 'Ivy Em',
    phone: '0123456789',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    image: '/uploads/Charging Cable Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '1 Hour Ago',    // shown in Recent Activity
=======
=======
>>>>>>> Stashed changes
    image: 'uploads/Charging Cable Picture.jpg',
    displayTime: '1 Hour Ago',
>>>>>>> Stashed changes
  },
  {
    id: 6,
    category: 'Other',
    itemName: 'Water Bottle',
    location: 'Library',
    description: 'Blue water bottle with stickers on it.',
    status: 'lost',
    contact: 'Carlos Reyes',
    phone: '0195812345',
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    image: '/uploads/Water Bottle Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '2 Mins Ago',    // shown in Recent Activity
=======
=======
>>>>>>> Stashed changes
    image: 'uploads/Water Bottle Picture.jpg',
    displayTime: '2 Mins Ago',
>>>>>>> Stashed changes
  },
];

/**
 * Fetches items from the Express API.
 * Falls back to PROTOTYPE_ITEMS if the server is offline or
 * the database is empty — keeps the demo working at all times.
 * @returns {Promise<Array>}
 */
async function getItems() {
  try {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error('non-ok');
    const data = await res.json();
    return data.length ? data : PROTOTYPE_ITEMS;
  } catch {
    return PROTOTYPE_ITEMS;
  }
}


/* ============================================================
<<<<<<< Updated upstream
<<<<<<< Updated upstream
   SECTION 1: TOAST NOTIFICATION UTILITY
   Contribution: [Your Name]
   Displays a non-blocking message at the bottom of the screen
   instead of browser alert() for a more polished UX.
=======
   UI UTILITIES (Toasts & Sidebar)
>>>>>>> Stashed changes
=======
   UI UTILITIES (Toasts & Sidebar)
>>>>>>> Stashed changes
   ============================================================ */

/**
 * Shows a toast notification that auto-dismisses.
 * @param {string} message - Text to display
 * @param {'success'|'error'|'info'} [type='info'] - Toast style
 * @param {number} [duration=3000] - Display time in ms
 */
function showToast(message, type = 'info', duration = 3000) {
  // Remove any existing toast to prevent overlap
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;

  // Toast needs to be inside the phone container to position correctly
  const container = document.querySelector('.phone-container') ?? document.body;
  container.appendChild(toast);

  // Trigger the CSS transition on the next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


/* ============================================================
   SECTION 2: SIDEBAR NAVIGATION
   Contribution: [Your Name]
   Opens / closes the slide-in left sidebar. The overlay
   click and Escape key both close it.
   ============================================================ */

/* CONTRIBUTION BY: [YOUR NAME] — Fixed Sidebar Handshake */

/* FIXED SIDEBAR LOGIC — CONTRIBUTION BY: [YOUR NAME] */

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  // We use 'open' because your styles.css (Section 14) uses .sidebar.open
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}

function initSidebar() {
  // Ensures clicking the dark overlay closes the menu
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  
  // Closes menu if 'Escape' key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}


/* ============================================================
<<<<<<< Updated upstream
<<<<<<< Updated upstream
   SECTION 3: PHOTO UPLOAD BOX
   Contribution: [Your Name]
   Makes the dashed upload area clickable and shows a preview
   of the selected image inside the box.
=======
   FORMS & VALIDATION
>>>>>>> Stashed changes
=======
   FORMS & VALIDATION
>>>>>>> Stashed changes
   ============================================================ */

function initUploadBox() {
  const uploadBox = document.querySelector('#upload-box');
  const fileInput = document.getElementById('itemPhoto');
  if (!uploadBox || !fileInput) return;

  // Click on box triggers hidden file input
  uploadBox.addEventListener('click', () => fileInput.click());

  // Keyboard accessibility: Enter or Space also triggers it
  uploadBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', () => {
    if (!fileInput.files?.length) return;
    const file = fileInput.files[0];

    // Show image preview inside the upload box
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadBox.innerHTML = `
        <img src="${e.target.result}" class="upload-preview" alt="Preview">
        <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.5);
                    color:white;font-size:11px;padding:3px 8px;border-radius:99px;">
          ✏️ Change
        </div>
      `;
      uploadBox.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });
}


/* ============================================================
   SECTION 4: CLIENT-SIDE FORM VALIDATION
   Contribution: [Your Name]
   Validates all required fields before the API call is made,
   highlights errors inline, and returns a boolean pass/fail.
   ============================================================ */

/**
 * Validates a single input field.
 * @param {string} fieldId - ID of the input element
 * @param {string} errorId - ID of the <span> showing the error
 * @returns {boolean} true if field is valid
 */
function validateField(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;

  const isEmpty = field.value.trim() === '' || field.value === '';
  field.classList.toggle('error', isEmpty);
  error.classList.toggle('show', isEmpty);

  return !isEmpty;
}

/**
 * Runs all form validations and scrolls to the first error.
 * @returns {boolean} true if all required fields pass
 */
function validateForm() {
  const checks = [
    validateField('category',    'error-category'),
    validateField('item-name',   'error-item-name'),
    validateField('location',    'error-location'),
    validateField('description', 'error-description'),
  ];

  const isValid = checks.every(Boolean);

  if (!isValid) {
    const firstError = document.querySelector('.input-field.error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fill in all required fields.', 'error');
  }

  return isValid;
}

// Live validation: clear the error as soon as the user types/selects
function initLiveValidation() {
  const pairs = [
    ['category',    'error-category'],
    ['item-name',   'error-item-name'],
    ['location',    'error-location'],
    ['description', 'error-description'],
  ];

  pairs.forEach(([fieldId, errorId]) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener('input', () => validateField(fieldId, errorId));
    field.addEventListener('change', () => validateField(fieldId, errorId));
  });
}


/* ============================================================
   SECTION 5: FORM SUBMIT HANDLER
   Contribution: [Your Name]
   Collects form data, validates it, then POSTs to /api/report.
   ============================================================ */

function initSubmitBtn() {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    if (!validateForm()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const fileInput  = document.getElementById('itemPhoto');
    const formData   = new FormData();
    if (fileInput?.files?.length) {
      formData.append('itemPhoto', fileInput.files[0]);
    }
    formData.append('category',    document.getElementById('category')?.value    ?? '');
    formData.append('itemName',    document.getElementById('item-name')?.value   ?? '');
    formData.append('location',    document.getElementById('location')?.value    ?? '');
    formData.append('description', document.getElementById('description')?.value ?? '');

    const isLost = window.location.pathname.includes('lostform');
    formData.append('status', isLost ? 'lost' : 'found');

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showToast('Your report has been posted!', 'success', 3000);
        setTimeout(() => window.location.href = 'index.html', 1500);
      } else {
        showToast('Server error — please try again.', 'error');
      }
    } catch (err) {
      console.error('[MapúaWhere] Submit error:', err);
      showToast('Connection failed. Is the server running?', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}


/* ============================================================
<<<<<<< Updated upstream
<<<<<<< Updated upstream
   SECTION 6: HOME PAGE — Recent Activity
   Contribution: [Your Name]
   Shows the 3 specific missing items with hardcoded time-ago
   strings exactly as specified for the prototype demo.
=======
   DATA LOADING (Home, Gallery, Details)
>>>>>>> Stashed changes
=======
   DATA LOADING (Home, Gallery, Details)
>>>>>>> Stashed changes
   ============================================================ */

async function loadRecentActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  // Use only the 3 missing (lost) items for Recent Activity,
  // displayed in the order: Water Bottle → Charging Cable → Airpods
  const RECENT = [
    { id: 6, name: 'Water Bottle',    timeAgo: '2 Mins Ago',   location: 'Library',              image: '/uploads/Water Bottle Picture.jpg' },
    { id: 5, name: 'Charging Cable',  timeAgo: '1 Hour Ago',   location: 'Cafeteria',            image: '/uploads/Charging Cable Picture.jpg' },
    { id: 4, name: 'Airpods',         timeAgo: '32 Mins Ago',  location: 'Ground Floor Bathroom', image: '/uploads/Aipods.jpg' },
  ];

  container.innerHTML = '';

  RECENT.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.animationDelay = `${index * 60}ms`;
    card.innerHTML = `
      <div class="item-img-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-meta">${item.timeAgo}</span>
        <span class="item-meta">📍 ${item.location}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `details.html?id=${item.id}`;
    });
    container.appendChild(card);
  });
}


/* ============================================================
   SECTION 7: GALLERY PAGE — Grid + Filter Chips
   Contribution: [Your Name]
   Loads all items into the 2-column grid, filtered by the
   selected category chip. Chip click triggers a reload.
   ============================================================ */

async function loadGallery(filter = 'All') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let items = await getItems();

  grid.innerHTML = '';

  if (filter !== 'All') {
    items = items.filter(item => {
      const cat    = (item.category ?? '').toLowerCase();
      const target = filter.toLowerCase();
      return cat === target || cat.includes(target) || target.includes(cat);
    });
  }

  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <span class="empty-state-icon">🔍</span>
        <p>No items found for <strong>"${filter}"</strong>.</p>
      </div>`;
    return;
  }

  [...items].reverse().forEach((item, index) => {
    const badgeClass = item.status === 'lost' ? 'badge-lost' :
                       item.status === 'found' ? 'badge-found' : 'badge-resolved';

    const card = document.createElement('div');
    card.className = 'grid-item';
    card.style.animationDelay = `${index * 40}ms`;
    card.innerHTML = `
      <div class="img-box">
        ${item.image
          ? `<img src="${item.image}" alt="${item.itemName}">`
          : '📦'}
      </div>
      <div class="grid-item-details">
        <span class="grid-item-name">${item.itemName}</span>
        <span class="grid-item-loc">📍 ${item.location}</span>
        <span class="grid-item-badge item-badge ${badgeClass}">
          ${item.status}
        </span>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `details.html?id=${item.id}`;
    });
    grid.appendChild(card);
  });
}

/**
 * Wires up the filter chip buttons on the gallery page.
 */
function setupFilters() {
  const chips = document.querySelectorAll('.chip');
  if (!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.getAttribute('data-category') ?? 'All';
      loadGallery(category);
    });
  });
}


/* ============================================================
   SECTION 8: DETAILS PAGE — Load Item Info
   
   Contribution: [HONEY]]
   Reads the ?id= param from the URL, finds the matching item,
   populates all detail elements including contact info and map.

   Contribution: [IVORY]
   Integrated Table and List population
   ============================================================ */

/* ============================================================
   SECTION 8: DETAILS PAGE — Load Item Info
   Contribution: Integrated Table and List population
   ============================================================ */

async function loadItemDetails() {
  // Guard clause: Only run if we are actually on the details page
  const nameEl = document.getElementById('detail-name');
  if (!nameEl) return; 

<<<<<<< Updated upstream
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  
  if (!itemId) {
    nameEl.textContent = 'No item selected.';
    return;
  }

  // Fetch data (Falls back to PROTOTYPE_ITEMS if API is offline)
  const items = await getItems(); 
  const item = items.find(i => String(i.id) === String(itemId));

  if (!item) {
    nameEl.textContent = 'Item not found.';
    return;
  }

  // 1. POPULATE DESCRIPTION TABLE
  // We use optional chaining (?.) to prevent the script from breaking if an ID is missing
  if (document.getElementById('detail-name')) nameEl.textContent = item.itemName;
  if (document.getElementById('detail-location')) document.getElementById('detail-location').textContent = item.location;
  if (document.getElementById('detail-category')) document.getElementById('detail-category').textContent = item.category;
  if (document.getElementById('detail-time')) document.getElementById('detail-time').textContent = item.displayTime || item.timestamp;
  if (document.getElementById('detail-description')) document.getElementById('detail-description').textContent = item.description;

  // 2. HERO IMAGE POPULATION
  const heroBox = document.getElementById('detail-img-hero');
  if (heroBox && item.image) {
    heroBox.innerHTML = `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);">`;
  }

  // 3. POPULATE ACTIVITY HISTORY LIST
  const historyList = document.getElementById('activity-history-list');
  if (historyList) {
=======
  const itemId = new URLSearchParams(window.location.search).get('id');
  const items = await getItems();
  const item = items.find(i => String(i.id) === String(itemId)) || PROTOTYPE_ITEMS[0];
  const set = (id, text) => { if(document.getElementById(id)) document.getElementById(id).textContent = text; };

  set('detail-name', item.itemName);
  set('detail-location', item.location);
  set('detail-category', item.category);
  set('detail-time', item.displayTime);
  set('detail-description', item.description);
  set('map-location-label', item.location);

  if (item.image) {
    document.getElementById('detail-img-hero').innerHTML = `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);">`;
  }

const historyList = document.getElementById('activity-history-list');
if (historyList && item) {
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    const statusAction = item.status === 'resolved' ? '✅ Item Returned' : `📌 Reported as ${item.status.toUpperCase()}`;
    historyList.innerHTML = `
      <li style="padding: 12px 0; border-bottom: 1px solid var(--gray-50); display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">📍</span>
        <div>
          <div style="font-size: 14px; font-weight: 700; color: var(--gray-900);">${statusAction}</div>
          <div style="font-size: 12px; color: var(--gray-500);">${item.displayTime || 'Just now'}</div>
        </div>
      </li>
    `;
<<<<<<< Updated upstream
  }
=======
}
  const pillMap = { lost: 'status-lost', found: 'status-found', resolved: 'status-resolved' };
  document.getElementById(pillMap[item.status])?.classList.add('active-status');
>>>>>>> Stashed changes

  // 4. RESTORED: CONTACT INFO POPULATION
  const contactList = document.getElementById('contact-meta-list');
  if (contactList) {
    contactList.innerHTML = `
      <div class="detail-meta-row" style="display:flex; gap:10px;">
        <span style="font-size:20px;">👤</span>
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--gray-400); text-transform:uppercase;">Contact Person</div>
          <div style="color:var(--gray-800); font-weight:500;">${item.contact} | ${item.phone}</div>
        </div>
      </div>`;
  }

  // 5. UPDATE UI STATES
  const pillMap = { lost: 'status-lost', found: 'status-found', resolved: 'status-resolved' };
  const activePill = document.getElementById(pillMap[item.status]);
  if (activePill) activePill.classList.add('active-status');

  // Sync Map labels
  const mapLabel = document.getElementById('map-location-label');
  if (mapLabel) mapLabel.textContent = item.location;


  // Message Reporter button
  const ctaBtn = document.getElementById('contact-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      showToast(`Messaging ${item.contact ?? 'reporter'} — coming soon!`);
    });
  }

  // Update page title
  document.title = `MapúaWhere — ${item.itemName}`;
}

<<<<<<< Updated upstream

/* ============================================================
<<<<<<< Updated upstream
   SECTION 9: ENTRY POINT — window.onload
   Contribution: [Your Name]
   Detects which page is loaded and initialises only the
   relevant functions, keeping performance lean.
=======
/* ============================================================
=======
>>>>>>> Stashed changes
   IMAGE MAP & VIEWPORT
   ============================================================ */
function syncMapLocation(roomName, event) {
    const container = document.getElementById('map-viewport');
    if (container && event) {
        container.scrollTo({
            left: event.offsetX - (container.offsetWidth / 2),
            top: event.offsetY - (container.offsetHeight / 2),
            behavior: 'smooth'
        });
    }
    const cap = document.getElementById('map-caption-text');
    if (cap) cap.textContent = `Centered on: ${roomName}`;
    showToast(`📍 Moving view to ${roomName}...`);
}

function fixMapCoordinates() {
    const img = document.getElementById('mapua-image');
    const map = document.getElementsByName('image-map')[0];
    if (!img || !map) return;

    const scaleX = img.clientWidth / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;

    Array.from(map.getElementsByTagName('area')).forEach(area => {
        if (!area.dataset.originalCoords) area.dataset.originalCoords = area.coords;
        area.coords = area.dataset.originalCoords.split(',').map((c, i) => Math.round(c * (i % 2 === 0 ? scaleX : scaleY))).join(',');
    });
}

/* ============================================================
  ENTRY POINT
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
   ============================================================ */

window.addEventListener('load', () => {
  // Functions that run on every page
  initSidebar();        // sidebar open/close
  initUploadBox();
  initLiveValidation();
  initSubmitBtn();

  // Page-specific functions
  loadRecentActivity(); // index.html
  setupFilters();       // gallery.html
  loadGallery();        // gallery.html
  loadItemDetails();    // details.html
  // (Each function guards itself with an early return if its
  //  key element isn't present on the current page.)
});
