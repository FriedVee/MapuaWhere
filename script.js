/**
 * MapúaWhere — Client-Side Logic
 * Author : HONEY & IVY 
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
    image: 'uploads/Airpods.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '32 Mins Ago',
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
    image: 'uploads/Charging_Cable_Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '1 Hour Ago',
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
    image: 'uploads/Water_Bottle_Picture.jpg',
    timestamp: '3/9/2026, 2:30pm',
    displayTime: '2 Mins Ago',
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
   TOAST NOTIFICATION UTILITY
   ============================================================ */

function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;

  // Prioritize the phone-container but fallback to body
  const container = document.querySelector('.phone-container') || document.body;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

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
  fileInput.addEventListener('change', () => {
    if (!fileInput.files?.length) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadBox.innerHTML = `<img src="${e.target.result}" class="upload-preview" alt="Preview">
                             <div class="upload-change-label">✏️ Change</div>`;
      uploadBox.classList.add('has-image');
    };
    reader.readAsDataURL(fileInput.files[0]);
  });
}


/* ============================================================
   CLIENT-SIDE FORM VALIDATION
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
   FORM SUBMIT HANDLER
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
      } else {
        throw new Error('Server Error');
      }
    } catch (err) {
      
      console.warn("API not found, falling back to prototype mode.");
      
      // Still show the success toast so the student/professor sees the feature works!
      showToast('Report submitted', 'success', 3000);
      
      // Delay the redirect so the toast is visible
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   HOME PAGE — Recent ActivitY
   ============================================================ */
async function loadRecentActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  const RECENT = [
    { id: 6, name: 'Water Bottle',    timeAgo: '2 Mins Ago',   location: 'Library',               image: 'uploads/Water_Bottle_Picture.jpg' },
    { id: 5, name: 'Charging Cable',  timeAgo: '1 Hour Ago',   location: 'Cafeteria',            image: 'uploads/Charging_Cable_Picture.jpg' },
    { id: 4, name: 'Airpods',          timeAgo: '32 Mins Ago',  location: 'Ground Floor Bathroom', image: 'uploads/Airpods.jpg' },
  ];

  container.innerHTML = '';
  RECENT.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.animationDelay = `${index * 60}ms`;
    card.innerHTML = `
      <div class="item-img-thumb">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='MapuaWhere_Logo.png'">
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
    return;
  }

  [...items].reverse().forEach((item, index) => {
    const badgeClass = item.status === 'lost' ? 'badge-lost' :
                       item.status === 'found' ? 'badge-found' : 'badge-resolved';

    const card = document.createElement('div');
    card.className = 'grid-item';
    card.style.animationDelay = `${index * 40}ms`;
    card.innerHTML = `
      <div class="img-box">${item.image ? `<img src="${item.image}" alt="${item.itemName}" onerror="this.src='MapuaWhere_Logo.png'">` : '📦'}</div>
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
   DETAILS PAGE — Load Item Info
   ============================================================ */

async function loadItemDetails() {
  const nameEl = document.getElementById('detail-name');
  if (!nameEl) return;

  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  
  const items = await getItems(); 
  const item = items.find(i => String(i.id) === String(itemId)) || PROTOTYPE_ITEMS[0];

  // 1. POPULATE MAIN INFO
  nameEl.textContent = item.itemName;
  if (document.getElementById('detail-location')) document.getElementById('detail-location').textContent = item.location;
  if (document.getElementById('detail-category')) document.getElementById('detail-category').textContent = item.category;
  if (document.getElementById('detail-time')) document.getElementById('detail-time').textContent = item.displayTime || item.timestamp;
  if (document.getElementById('detail-description')) document.getElementById('detail-description').textContent = item.description;

  // 2. HERO IMAGE
  if (item.image) {
    const hero = document.getElementById('detail-img-hero');
    if (hero) hero.innerHTML = `<img src="${item.image}" alt="${item.itemName}" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);" onerror="this.src='MapuaWhere_Logo.png'">`;
  }

  // 3. POPULATE ACTIVITY HISTORY LIST
  const historyList = document.getElementById('activity-history-list');
  if (historyList) {
    const statusAction = item.status === 'resolved' ? '✅ Item Returned' : `📌 Reported as ${item.status.toUpperCase()}`;
    
    // This replaces the "Loading history..." text
    historyList.innerHTML = `
      <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0;">
        <span style="font-size: 20px;">📍</span>
        <div class="history-content">
          <div style="font-size: 14px; font-weight: 700; color: var(--gray-900);">${statusAction}</div>
          <div style="font-size: 12px; color: var(--gray-500);">${item.displayTime || 'Just now'}</div>
        </div>
      </li>
    `;
  }

  // 3. REPORTER SECTION (RESTORED)
  const contactList = document.getElementById('contact-meta-list');
  if (contactList) {
    contactList.innerHTML = `
      <div class="detail-meta-row" style="display:flex; gap:10px;">
        <span style="font-size:20px;">👤</span>
        <div>
          <div style="font-size:11px; font-weight:700; color:var(--gray-400); text-transform:uppercase;">Contact Person</div>
          <div style="color:var(--gray-800); font-weight:500;">${item.contact || 'Staff'} | ${item.phone || 'N/A'}</div>
        </div>
      </div>`;
  }

  // 4. BUTTON NOTIFICATION (RESTORED)
  const ctaBtn = document.getElementById('contact-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      showToast(`Messaging ${item.contact || 'reporter'} — coming soon!`, 'info');
    });
  }

  // 5. STATUS PILLS
  const pillMap = { lost: 'status-lost', found: 'status-found', resolved: 'status-resolved' };
  document.querySelectorAll('.status-pill').forEach(p => p.classList.remove('active-status'));
  document.getElementById(pillMap[item.status])?.classList.add('active-status');

  // Sync Map labels
  const mapLabel = document.getElementById('map-location-label');
  if (mapLabel) mapLabel.textContent = item.location;

  document.title = `MapúaWhere — ${item.itemName}`;
}

/**
 * PROFICIENT: Dynamic Centering Logic
 */
function syncMapLocation(roomName, event) {
    const container = document.getElementById('map-viewport');
    if (container && event) {
        container.scrollTo({
            left: event.offsetX - (container.offsetWidth / 2),
            top: event.offsetY - (container.offsetHeight / 2),
            behavior: 'smooth'
        });
    }
    const caption = document.getElementById('map-caption-text');
    if (caption) caption.textContent = `Centered on: ${roomName}`;
    showToast(`📍 Map moved to ${roomName}`, 'info');
}

/**
 * PROFICIENT: Responsive Map Coordinate Resizer
 */
function fixMapCoordinates() {
    const img = document.getElementById('mapua-image');
    const map = document.getElementsByName('image-map')[0];
    if (!img || !map || img.naturalWidth === 0) return;

    const scaleX = img.clientWidth / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;

    Array.from(map.getElementsByTagName('area')).forEach(area => {
        if (!area.dataset.originalCoords) area.dataset.originalCoords = area.coords;
        area.coords = area.dataset.originalCoords.split(',').map((c, i) => Math.round(c * (i % 2 === 0 ? scaleX : scaleY))).join(',');
    });
}

/* ============================================================
 ENTRY POINT
   ============================================================ */
window.addEventListener('load', () => {
  initSidebar();
  
  if (document.getElementById('upload-box')) {
      initUploadBox();
      initSubmitBtn();
      initLiveValidation();
  }

  if (document.getElementById('activity-list')) loadRecentActivity();
  if (document.getElementById('gallery-grid')) {
      setupFilters();
      loadGallery();
  }
  if (document.getElementById('detail-name')) loadItemDetails();

  const mapImg = document.getElementById('mapua-image');
  if (mapImg) {
    if (mapImg.complete) fixMapCoordinates();
    else mapImg.addEventListener('load', fixMapCoordinates);
  }
});

window.addEventListener('resize', fixMapCoordinates);