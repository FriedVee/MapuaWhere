/**
 * MapúaWhere — Client-Side Logic
 * Purpose: Handles UI interactions, data loading, and DOM updates.
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
    image: '/uploads/Bracelet.jpg',
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
    image: '/uploads/Keys.jpg',
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
    image: '/uploads/Aipods.jpg',
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
    image: '/uploads/Charging Cable Picture.jpg',
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
    image: '/uploads/Water Bottle Picture.jpg',
    displayTime: '2 Mins Ago',
  },
];

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
   SECTION 1: UI UTILITIES (Toasts & Sidebar)
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
   SECTION 2: FORMS & VALIDATION
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
  const fields = ['category', 'item-name', 'location', 'description'];
  const isValid = fields.map(f => validateField(f, `error-${f}`)).every(Boolean);

  if (!isValid) {
    document.querySelector('.input-field.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fill in all required fields.', 'error');
  }
  return isValid;
}

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
      const res = await fetch('/api/report', { method: 'POST', body: formData });
      if (res.ok) {
        showToast('Your report has been posted!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
      }
    } catch (err) {
      showToast('Connection failed.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   SECTION 3: DATA LOADING (Home, Gallery, Details)
   ============================================================ */
async function loadRecentActivity() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  const RECENT = [
    { id: 6, name: 'Water Bottle', timeAgo: '2 Mins Ago', location: 'Library', image: '/uploads/Water Bottle Picture.jpg' },
    { id: 5, name: 'Charging Cable', timeAgo: '1 Hour Ago', location: 'Cafeteria', image: '/uploads/Charging Cable Picture.jpg' },
    { id: 4, name: 'Airpods', timeAgo: '32 Mins Ago', location: 'Ground Floor Bathroom', image: '/uploads/Aipods.jpg' },
  ];

  container.innerHTML = RECENT.map((item, index) => `
    <div class="item-card" onclick="window.location.href='details.html?id=${item.id}'" style="animation-delay: ${index * 60}ms">
      <div class="item-img-thumb"><img src="${item.image}" alt="${item.name}"></div>
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-meta">${item.timeAgo}</span>
        <span class="item-meta">📍 ${item.location}</span>
      </div>
    </div>`).join('');
}

async function loadGallery(filter = 'All') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let items = await getItems();
  if (filter !== 'All') {
    items = items.filter(i => (i.category ?? '').toLowerCase().includes(filter.toLowerCase()));
  }

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>No items found.</p></div>`;
    return;
  }

  grid.innerHTML = items.reverse().map((item, index) => `
    <div class="grid-item" onclick="window.location.href='details.html?id=${item.id}'" style="animation-delay: ${index * 40}ms">
      <div class="img-box">${item.image ? `<img src="${item.image}" alt="${item.itemName}">` : '📦'}</div>
      <div class="grid-item-details">
        <span class="grid-item-name">${item.itemName}</span>
        <span class="grid-item-loc">📍 ${item.location}</span>
        <span class="grid-item-badge item-badge badge-${item.status}">${item.status}</span>
      </div>
    </div>`).join('');
}

async function loadItemDetails() {
  const nameEl = document.getElementById('detail-name');
  if (!nameEl) return;

  const itemId = new URLSearchParams(window.location.search).get('id');
  const items = await getItems();
  const item = items.find(i => String(i.id) === String(itemId)) || PROTOTYPE_ITEMS[0];

  // Helper for text population
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
    // This replaces the "Loading history..." text with real data
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
  // Update Status Pills
  const pillMap = { lost: 'status-lost', found: 'status-found', resolved: 'status-resolved' };
  document.getElementById(pillMap[item.status])?.classList.add('active-status');

  document.title = `MapúaWhere — ${item.itemName}`;
}

/* ============================================================
   SECTION 4: IMAGE MAP & VIEWPORT
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
   SECTION 5: ENTRY POINT
   ============================================================ */
window.addEventListener('load', () => {
  initSidebar();
  initUploadBox();
  initSubmitBtn();
  loadRecentActivity();
  loadGallery();
  loadItemDetails();
  fixMapCoordinates();
  
  // Setup Gallery Filters
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadGallery(chip.getAttribute('data-category') ?? 'All');
    });
  });
});

window.addEventListener('resize', fixMapCoordinates);