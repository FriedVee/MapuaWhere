/**
 * MapúaWhere — Client-Side Logic
 * Author : [Your Name]
 * Course : ITS121 Web Systems and Technologies
 * Purpose: Handles UI interactions, client-side validation,
 * data loading from the Express API, and DOM updates
 * for all pages (index, gallery, details, forms).
 * ─────────────────────────────────────────────────────────────
 */

/* ============================================================
   SECTION 0: PROTOTYPE DATA
   ============================================================ */
const PROTOTYPE_ITEMS = [
  {
    id: 1,
    category: 'Clothing/Accessories',
    itemName: 'Totoro Pouch',
    location: '2nd Floor Bathroom',
    description: 'Totoro Pouch with mini cabbage and star keychain on it and coins inside.',
    status: 'resolved',
    contact: 'Honey Lee',
    phone: '0123456798',
    image: 'uploads/Totoro_Pouch.jpg',
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
    image: 'uploads/Bracelet.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '3/9/2026, 2:30pm',
  },
  {
    id: 3,
    category: 'Wallets/Keys/IDs',
    itemName: 'Keys',
    location: 'Back Entrance',
    description: '3 keys, one black and two plain silver, it has a kraftvear & n1 keychain.',
    status: 'found',
    contact: 'Alaina Kim',
    phone: '0173456789',
    image: 'uploads/Keys.jpg',
    timestamp: '3/9/2026, 2:30pm',
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
    image: 'uploads/Aipods.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '32 Mins Ago',   // shown in Recent Activity
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
    image: 'uploads/Charging Cable Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '1 Hour Ago',    // shown in Recent Activity
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
    image: 'uploads/Water Bottle Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '2 Mins Ago',    // shown in Recent Activity
  },
];

/**
 * Fetches items from the Express API.
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
   SECTION 1: TOAST NOTIFICATION UTILITY
   Contribution: [Your Name]
   ============================================================ */

function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;

  const container = document.querySelector('.phone-container') ?? document.body;
  container.appendChild(toast);

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
   ============================================================ */

function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar?.classList.toggle('open');
  overlay?.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}

function initSidebar() {
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}

/* ============================================================
   SECTION 3: PHOTO UPLOAD BOX
   Contribution: [Your Name]
   ============================================================ */
function initUploadBox() {
  const uploadBox = document.querySelector('#upload-box');
  const fileInput = document.getElementById('itemPhoto');
  if (!uploadBox || !fileInput) return;

  uploadBox.addEventListener('click', () => fileInput.click());
  uploadBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', () => {
    if (!fileInput.files?.length) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadBox.innerHTML = `<img src="${e.target.result}" class="upload-preview" alt="Preview">
                             <div class="upload-change-label">✏️ Change</div>`;
      uploadBox.classList.add('has-image');
    };
    reader.readAsDataURL(file);
  });
}


/* ============================================================
   SECTION 4: CLIENT-SIDE FORM VALIDATION
   Contribution: [Your Name]
   ============================================================ */

function validateField(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;

  const isEmpty = field.value.trim() === '';
  field.classList.toggle('error', isEmpty);
  error.classList.toggle('show', isEmpty);
  return !isEmpty;
}

function validateForm() {
  const checks = [
    validateField('category',    'error-category'),
    validateField('item-name',   'error-item-name'),
    validateField('location',    'error-location'),
    validateField('description', 'error-description'),
  ];
  const isValid = checks.every(Boolean);
  if (!isValid) {
    document.querySelector('.input-field.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fill in all required fields.', 'error');
  }
  return isValid;
}

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
   ============================================================ */

function initSubmitBtn() {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    if (!validateForm()) return;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData();
    const fileInput = document.getElementById('itemPhoto');
    if (fileInput?.files[0]) formData.append('itemPhoto', fileInput.files[0]);
    
    ['category', 'item-name', 'location', 'description'].forEach(id => {
        const val = document.getElementById(id)?.value ?? '';
        formData.append(id === 'item-name' ? 'itemName' : id, val);
    });

    formData.append('status', window.location.pathname.includes('lostform') ? 'lost' : 'found');

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        showToast('Your report has been posted!', 'success', 3000);
        setTimeout(() => window.location.href = 'index.html', 1500);
      }
    } catch (err) {
      showToast('Connection failed. Is the server running?', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   SECTION 6: HOME PAGE — Recent Activity
   Contribution: [Your Name]
   ============================================================ */
async function loadRecentActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  const RECENT = [
    { id: 6, name: 'Water Bottle',    timeAgo: '2 Mins Ago',   location: 'Library',               image: 'uploads/Water Bottle Picture.jpg' },
    { id: 5, name: 'Charging Cable',  timeAgo: '1 Hour Ago',   location: 'Cafeteria',            image: 'uploads/Charging Cable Picture.jpg' },
    { id: 4, name: 'Airpods',         timeAgo: '32 Mins Ago',  location: 'Ground Floor Bathroom', image: 'uploads/Aipods.jpg' },
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
   ============================================================ */

async function loadGallery(filter = 'All') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let items = await getItems();
  grid.innerHTML = '';

  if (filter !== 'All') {
    items = items.filter(i => (i.category ?? '').toLowerCase().includes(filter.toLowerCase()));
  }

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>No items found.</p></div>`;
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>No items found.</p></div>`;
    return;
  }

  [...items].reverse().forEach((item, index) => {
    const badgeClass = item.status === 'lost' ? 'badge-lost' :
                       item.status === 'found' ? 'badge-found' : 'badge-resolved';

    const card = document.createElement('div');
    card.className = 'grid-item';
    card.style.animationDelay = `${index * 40}ms`;
    card.innerHTML = `
      <div class="img-box">${item.image ? `<img src="${item.image}" alt="${item.itemName}">` : '📦'}</div>
      <div class="grid-item-details">
        <span class="grid-item-name">${item.itemName}</span>
        <span class="grid-item-loc">📍 ${item.location}</span>
        <span class="grid-item-badge item-badge ${badgeClass}">${item.status}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `details.html?id=${item.id}`;
    });
    grid.appendChild(card);
  });
}

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
   Contribution: [HONEY] - URL Params & Baseline Population
   Contribution: [IVORY] - Integrated Table & History List logic
   ============================================================ */

async function loadItemDetails() {
  const nameEl = document.getElementById('detail-name');
  if (!nameEl) return;

  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  if (!itemId) {
    nameEl.textContent = 'No item selected.';
    return;
  }

  const items = await getItems(); 
  const item = items.find(i => String(i.id) === String(itemId));

  if (!item) {
    nameEl.textContent = 'Item not found.';
    return;
  }

  // 1. POPULATE DESCRIPTION TABLE (Semantic Functional Table)
  if (document.getElementById('detail-name')) nameEl.textContent = item.itemName;
  if (document.getElementById('detail-location')) document.getElementById('detail-location').textContent = item.location;
  if (document.getElementById('detail-category')) document.getElementById('detail-category').textContent = item.category;
  if (document.getElementById('detail-time')) document.getElementById('detail-time').textContent = item.displayTime || item.timestamp;
  if (document.getElementById('detail-description')) document.getElementById('detail-description').textContent = item.description;

  if (item.image) {
    document.getElementById('detail-img-hero').innerHTML = `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);">`;
  }

  // 3. POPULATE ACTIVITY HISTORY LIST (Semantic List)
  const historyList = document.getElementById('activity-history-list');
  if (historyList) {
    const statusAction = item.status === 'resolved' ? '✅ Item Returned' : `📌 Reported as ${item.status.toUpperCase()}`;
    historyList.innerHTML = `
      <li>
        <span style="font-size: 20px;">📍</span>
        <div class="history-content">
          <div style="font-size: 14px; font-weight: 700; color: var(--gray-900);">${statusAction}</div>
          <div style="font-size: 12px; color: var(--gray-500);">${item.displayTime || 'Just now'}</div>
        </div>
      </li>
    `;
  }

  // 4. CONTACT INFO POPULATION (Restored Reporter section)
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

  // 5. UPDATE UI STATES (Status Pills)
  const pillMap = { lost: 'status-lost', found: 'status-found', resolved: 'status-resolved' };
  document.getElementById(pillMap[item.status])?.classList.add('active-status');

  // Sync Map labels
  const mapLabel = document.getElementById('map-location-label');
  if (mapLabel) mapLabel.textContent = item.location;

  // Message Reporter button logic
  const ctaBtn = document.getElementById('contact-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      showToast(`Messaging ${item.contact ?? 'reporter'} — coming soon!`);
    });
  }

  document.title = `MapúaWhere — ${item.itemName}`;
}

/**
 * MapúaWhere — Image Map Logic
 * Syncs map taps to the UI labels.
 */
/**
 * PROFICIENT: Dynamic Map Centering
 * Moves the viewport to the tapped coordinates.
 */
/**
 * PROFICIENT: Dynamic Centering Logic
 * Moves the map viewport based on the tapped coordinate
 */
function syncMapLocation(roomName, event) {
    const container = document.getElementById('map-viewport');
    const img = event.target;

    if (container && img) {
        // 1. Calculate the click position relative to the image
        const rect = img.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // 2. Calculate the center of the viewport
        const scrollX = offsetX - (container.clientWidth / 2);
        const scrollY = offsetY - (container.clientHeight / 2);

        // 3. Perform the move
        container.scrollTo({
            left: scrollX,
            top: scrollY,
            behavior: 'smooth'
        });
    }

    // Update labels and show feedback
    const caption = document.getElementById('map-caption-text');
    if (caption) caption.textContent = `Centered on: ${roomName}`;
    
    const tableLoc = document.getElementById('detail-location');
    if (tableLoc) {
        tableLoc.textContent = roomName;
        tableLoc.style.color = 'var(--red-500)';
    }

    showToast(`📍 Map moved to ${roomName}`, 'info');
}

/* ============================================================
   SECTION 9: ENTRY POINT
   Contribution: [Your Name]
   ============================================================ */
/* ============================================================
   SECTION 9: ENTRY POINT
   ============================================================ */
window.addEventListener('load', () => {
  // 1. Initialize Global UI
  initSidebar();
  
  // 2. Initialize Form Logic (Only if on a form page)
  if (document.getElementById('upload-box')) {
      initUploadBox();
      initSubmitBtn();
      // Only call if the function exists
      if (typeof initLiveValidation === "function") initLiveValidation();
  }

  // 3. Load Page-Specific Content
  // Only load recent activity if on the Home Page
  if (document.getElementById('activity-list')) {
      loadRecentActivity();
  }

  // Only load gallery if on the Gallery Page
  if (document.getElementById('gallery-grid')) {
      setupFilters();
      loadGallery();
  }

  // Only load item details if on the Details Page
  if (document.getElementById('detail-name')) {
      loadItemDetails();
  }
  
  // REMOVE: syncMapLocation() - This should NEVER be called on load.
  // It only triggers when a user clicks a room on your map.
});
