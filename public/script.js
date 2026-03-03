// 1. Setup the Image Upload click behavior
const uploadBox = document.querySelector('.upload-box');
const fileInput = document.getElementById('itemPhoto');

if (uploadBox && fileInput) {
    uploadBox.onclick = () => fileInput.click();
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            uploadBox.querySelector('p').innerText = fileInput.files[0].name;
        }
    };
}

// 2. The Universal Submit Logic
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Posting...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append('itemPhoto', fileInput?.files[0]);
        formData.append('category', document.getElementById('category')?.value);
        formData.append('itemName', document.getElementById('item-name')?.value);
        formData.append('location', document.getElementById('location')?.value);
        formData.append('description', document.getElementById('description')?.value);
        
        const isLost = window.location.href.includes('form2.html');
        formData.append('status', isLost ? 'lost' : 'found');

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Success! Your report has been posted.');
                window.location.reload();
            } else {
                alert('Server error.');
            }
        } catch (err) {
            console.error('Connection error:', err);
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 3. Load Recent Activity (index.html)
async function loadRecentActivity() {
    const container = document.getElementById('activity-list');
    // GUARD: Only run on index.html if the activity-list div is present
    if (!container) return;

    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        container.innerHTML = ""; 

        if (items.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding: 20px;'>No items reported yet.</p>";
            return;
        }

        items.reverse().slice(0, 5).forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="item-img-placeholder">
                    ${item.image ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover;">` : '☒'}
                </div>
                <div class="item-info">
                    <span class="item-name">${item.itemName}</span>
                    <span class="item-meta">${item.timestamp}</span>
                    <span class="item-meta">📍 ${item.location}</span>
                </div>
            `;
            card.onclick = () => window.location.href = `details.html?id=${item.id}`;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading activity:", err);
    }
}

// 4. Load Full Gallery with Filtering (gallery.html)
async function loadGallery(filter = "All") {
    const galleryGrid = document.querySelector('.item-grid-container'); 
    // GUARD: Only run if we are on the gallery page
    if (!galleryGrid) return;

    try {
        const response = await fetch('/api/items');
        let items = await response.json();
        
        galleryGrid.innerHTML = ""; 

        if (filter !== "All") {
            items = items.filter(item => {
                const itemCat = item.category ? item.category.toLowerCase() : "";
                const filterCat = filter.toLowerCase();
                return itemCat === filterCat || itemCat.includes(filterCat);
            });
        }

        if (items.length === 0) {
            galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">No items found for "${filter}".</p>`;
            return;
        }

        items.reverse().forEach(item => {
            const card = document.createElement('div');
            card.className = 'grid-item'; 
            card.style.cursor = "pointer";
            card.innerHTML = `
                <div class="img-box">
                    ${item.image ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover;">` : '<span>✕</span>'}
                </div>
                <div class="item-details">
                    <span class="name">${item.itemName}</span>
                    <span class="loc">${item.location}</span>
                </div>
            `;
            card.onclick = () => window.location.href = `details.html?id=${item.id}`;
            galleryGrid.appendChild(card);
        });
    } catch (err) { console.error("Error loading gallery:", err); }
}

// 5. Setup Category Filters (gallery.html)
function setupFilters() {
    const chips = document.querySelectorAll('.chip');
    if (chips.length === 0) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.getAttribute('data-category');
            loadGallery(category);
        });
    });
}

// 6. Load Item Details (details.html)
async function loadItemDetails() {
    const detailName = document.getElementById('detail-name');
    if (!detailName) return; // Only run on details.html

    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    if (!itemId) return;

    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        const item = items.find(i => i.id == itemId);

        if (item) {
            document.getElementById('detail-name').innerText = item.itemName;
            document.getElementById('detail-location').innerText = item.location;
            document.getElementById('detail-description').innerText = item.description;
            
            const imgBox = document.getElementById('item-image');
            if (item.image && imgBox) {
                imgBox.innerHTML = `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
            }

            const statusLost = document.getElementById('status-lost');
            const statusFound = document.getElementById('status-found');
            if (item.status === 'lost') statusLost?.classList.add('active-status');
            if (item.status === 'found') statusFound?.classList.add('active-status');
        }
    } catch (err) {
        console.error("Error loading details:", err);
    }
}

// Global Load Trigger
window.onload = () => {
    loadRecentActivity();
    loadGallery();
    setupFilters();
    loadItemDetails();
};