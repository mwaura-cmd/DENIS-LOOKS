/**
 * Aura Nails Hub - Main Application Engine
 * Handles Data Catalog, Gallery Filtering & Search, Image Uploads,
 * Lightbox Modal, Interactive Calculator, and Firebase Sync.
 */

// Initial Seed Data (All 14 Recent Sets + 10 Inspo Looks)
const DEFAULT_SETS = [
 {
 id: "set_01",
 title: "Gloss Natural Glaze",
 category: "Gel Polish",
 style: "Plain on Natural Nails",
 description: "Ultra-clean cuticles and prep with high-gloss non-chip glass topcoat.",
 price: 400,
 imageUrl: "nails1.png.png",
 tags: ["GelPolish", "NaturalNails", "Minimalist", "Glossy"],
 likes: 24,
 createdAt: "2026-08-01T10:00:00.000Z"
 },
 {
 id: "set_02",
 title: "Classic Parisian French",
 category: "Tips + Gel",
 style: "Classic French Tips Extension",
 description: "Crisp white curved smile lines with flawless natural nude base.",
 price: 800,
 imageUrl: "nails2.png.png",
 tags: ["FrenchTips", "TipsGel", "Timeless", "CleanGirl"],
 likes: 38,
 createdAt: "2026-08-02T11:30:00.000Z"
 },
 {
 id: "set_03",
 title: "Liquid Chrome & 3D Drops",
 category: "3D & Chrome Art",
 style: "3D Sculpted & Chrome Accents",
 description: "Futuristic molten silver chrome with raised 3D glass raindrops.",
 price: 1200,
 imageUrl: "nails3.png.png",
 tags: ["Chrome", "3DArt", "Editorial", "Molten"],
 likes: 52,
 createdAt: "2026-08-03T14:15:00.000Z"
 },
 {
 id: "set_04",
 title: "Complex 3D Nebula Art",
 category: "3D & Chrome Art",
 style: "Complex Arts + Multi-layer 3D",
 description: "Handcrafted textured 3D gel swirls with celestial chrome accents.",
 price: 1500,
 imageUrl: "nails4.png.png",
 tags: ["3DArt", "Signature", "ComplexDesign", "Luxury"],
 likes: 45,
 createdAt: "2026-08-04T16:00:00.000Z"
 },
 {
 id: "set_05",
 title: "Blush Centered Aura Ombré",
 category: "Gel Polish",
 style: "Centered Ombré Design",
 description: "Airbrushed aura glow fading outwards from deep rose to milky quartz.",
 price: 900,
 imageUrl: "nails5.png.png",
 tags: ["Aura", "Ombre", "Blush", "AirbrushLook"],
 likes: 41,
 createdAt: "2026-08-05T09:45:00.000Z"
 },
 {
 id: "set_06",
 title: "Soft Nude French Curve",
 category: "Tips + Gel",
 style: "Nude French Tips Extension",
 description: "Almond shaped extensions with modern micro-french nude borders.",
 price: 1000,
 imageUrl: "nails6.png.png",
 tags: ["NudeFrench", "Almond", "TipsGel", "SubtleLuxury"],
 likes: 29,
 createdAt: "2026-08-06T13:20:00.000Z"
 },
 {
 id: "set_07",
 title: "Platinum Mirror Chrome",
 category: "3D & Chrome Art",
 style: "3D Chrome Accents",
 description: "High-specular silver mirror finish with custom textured accents.",
 price: 1100,
 imageUrl: "nails7.png.png",
 tags: ["MirrorChrome", "Platinum", "Trendy", "Shine"],
 likes: 33,
 createdAt: "2026-08-07T15:10:00.000Z"
 },
 {
 id: "set_08",
 title: "Sculpted 3D Moulding",
 category: "Gumgel Overlays",
 style: "Chrome 3D & Sculpted Moulding",
 description: "Heavy structural Gumgel overlays with dimensional moulding art.",
 price: 1600,
 imageUrl: "nails8.png.png",
 tags: ["Gumgel", "Sculpted", "Moulding", "HeavyArt"],
 likes: 49,
 createdAt: "2026-08-08T17:30:00.000Z"
 },
 {
 id: "set_09",
 title: "Milky Quartz Natural Ombré",
 category: "Gel Polish",
 style: "Ombre on Natural Nails",
 description: "Seamless gradient transition on healthy reinforced natural nails.",
 price: 600,
 imageUrl: "nails9.png.png",
 tags: ["NaturalNails", "MilkyOmbre", "Minimal", "Gel"],
 likes: 27,
 createdAt: "2026-08-09T11:00:00.000Z"
 },
 {
 id: "set_10",
 title: "Clean Minimalist Chrome",
 category: "3D & Chrome Art",
 style: "Simple Chrome Minimal Line Art",
 description: "Single chrome line ribbons over translucent nude jelly base.",
 price: 950,
 imageUrl: "nails10.png.png",
 tags: ["Chrome", "Minimalist", "JellyNails", "Modern"],
 likes: 31,
 createdAt: "2026-08-10T12:45:00.000Z"
 },
 {
 id: "set_11",
 title: "Cyberpunk Chrome Stiletto",
 category: "3D & Chrome Art",
 style: "Chrome 3D Long Stiletto",
 description: "Extra long stiletto extensions with sharp chrome claw details.",
 price: 1800,
 imageUrl: "nails11.png.png",
 tags: ["Stiletto", "LongNails", "Chrome", "Baddie"],
 likes: 64,
 createdAt: "2026-08-11T18:00:00.000Z"
 },
 {
 id: "set_12",
 title: "Obsidian Marble & 3D Veins",
 category: "3D & Chrome Art",
 style: "Marble Design + 3D Textures",
 description: "Smoky quartz and obsidian stone veining layered under 3D gloss.",
 price: 1400,
 imageUrl: "nails12.png.png",
 tags: ["Marble", "3D", "StoneArt", "Luxury"],
 likes: 39,
 createdAt: "2026-08-12T14:30:00.000Z"
 },
 {
 id: "set_13",
 title: "Sunset Glow Ombré Stiletto",
 category: "Tips + Gel",
 style: "Ombre Long Stiletto Extension",
 description: "Fiery sunset aura ombre blended to perfection on sharp stilettos.",
 price: 1500,
 imageUrl: "nails13.png.png",
 tags: ["Ombre", "Stiletto", "SunsetGlow", "Vibrant"],
 likes: 42,
 createdAt: "2026-08-13T16:45:00.000Z"
 },
 {
 id: "set_14",
 title: "Luxe Russian Gel Pedicure",
 category: "Pedicure",
 style: "Plain Gel on Toes & Deep Prep",
 description: "Clean cuticle transformation and high-gloss gel pedicure.",
 price: 500,
 imageUrl: "nails14.png.png",
 tags: ["Pedicure", "Toes", "CleanPrep", "Gloss"],
 likes: 21,
 createdAt: "2026-08-14T10:15:00.000Z"
 }
];

const INSPO_ITEMS = [
 { id: "inspo_1", img: "inspo1.png.png", category: "Gel: Natural", style: "Minimalist Chic" },
 { id: "inspo_2", img: "inspo2.png.png", category: "Gel: Natural", style: "Nude Elegance" },
 { id: "inspo_3", img: "inspo3.png.png", category: "Tips + Gel", style: "Chrome Artistry" },
 { id: "inspo_4", img: "inspo4.png.png", category: "Tips + Gel", style: "Plain High-Gloss" },
 { id: "inspo_5", img: "inspo5.png.png", category: "Tips + Gel", style: "Classic French Tips" },
 { id: "inspo_6", img: "inspo6.png.png", category: "Tips + Gel", style: "3D Design Art" },
 { id: "inspo_7", img: "inspo7.png.png", category: "Gumgel: Natural", style: "Chrome Effects" },
 { id: "inspo_8", img: "inspo8.png.png", category: "Gumgel + Tips", style: "Plain Structure" },
 { id: "inspo_9", img: "inspo9.png.png", category: "Gumgel: Natural", style: "Modern French" },
 { id: "inspo_10", img: "inspo10.png.png", category: "Gumgel + Tips", style: "3D Sculpted Art" }
];

// App State
let allSets = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSelectedImageBase64 = null;
let activeLightboxSet = null;

const WHATSAPP_PHONE = '254741959888';
const ADMIN_PASS_HASH = '3fe655d6'; // simple hash of 'aura2024' - change via checkAdminPass()

function checkAdminPass() {
 const entered = prompt('Enter admin password to upload:');
 if (!entered) return false;
 // Simple 8-char hash check (djb2)
 let hash = 5381;
 for (let i = 0; i < entered.length; i++) {
 hash = ((hash << 5) + hash) + entered.charCodeAt(i);
 hash = hash & 0xFFFFFFFF;
 }
 const hexHash = (hash >>> 0).toString(16).padStart(8, '0');
 return hexHash === ADMIN_PASS_HASH;
}

document.addEventListener('DOMContentLoaded', async () => {
 initApp();
});

async function initApp() {
 // 1. Initialize Firebase / Local Storage
 if (window.firebaseManager) {
 await window.firebaseManager.initialize();
 }

 // 2. Load sets (Seed default + custom sets)
 loadAllSets();

 // 3. Render initial views
 renderGallery();
 renderInspoVault();
 initFilterTabs();
 initSearch();
 initUploadModal();
 initLightboxModal();
 initPriceCalculator();
 initPaymentModalListeners();
 initFirebaseModal();
 initMobileNav();
}

/* ==========================================================================
 DATA MANAGEMENT & SYNC
 ========================================================================== */
function loadAllSets() {
 const customSets = window.firebaseManager ? window.firebaseManager.getLocalSets() : [];
 
 // Combine custom sets with defaults (custom sets appear first)
 const combinedMap = new Map();
 customSets.forEach(s => combinedMap.set(s.id, s));
 DEFAULT_SETS.forEach(s => {
 if (!combinedMap.has(s.id)) combinedMap.set(s.id, s);
 });

 allSets = Array.from(combinedMap.values());

 // Listen for live Firestore updates if configured
 if (window.firebaseManager) {
 window.firebaseManager.subscribeToSets((remoteSets) => {
 if (remoteSets && remoteSets.length > 0) {
 remoteSets.forEach(s => combinedMap.set(s.id, s));
 allSets = Array.from(combinedMap.values());
 renderGallery();
 }
 });
 }
}

/* ==========================================================================
 GALLERY RENDERING & FILTERING
 ========================================================================== */
function renderGallery() {
 const galleryContainer = document.getElementById('gallery-grid');
 if (!galleryContainer) return;

 const filtered = allSets.filter(set => {
 const matchesCategory = currentCategory === 'all' || 
 set.category.toLowerCase().includes(currentCategory.toLowerCase()) ||
 (currentCategory === '3d' && (set.category.includes('3D') || set.tags?.includes('3DArt')));

 const matchesSearch = !currentSearchQuery || 
 set.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
 set.style.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
 (set.tags && set.tags.some(t => t.toLowerCase().includes(currentSearchQuery.toLowerCase())));

 return matchesCategory && matchesSearch;
 });

 if (filtered.length === 0) {
 galleryContainer.innerHTML = `
 <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
 <div style="font-size: 3rem; margin-bottom: 15px;"></div>
 <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 8px;">No sets found</h3>
 <p style="color: var(--text-muted); font-size: 0.9rem;">Try selecting another category or clear your search term.</p>
 </div>
 `;
 return;
 }

 galleryContainer.innerHTML = filtered.map(set => {
 const depositAmount = Math.ceil(set.price * 0.3);
 return `
 <div class="gallery-card tilt-card" data-id="${set.id}">
 <div class="card-image-wrap" onclick="openLightbox('${set.id}')">
 <img src="${set.imageUrl}" alt="${set.title}" loading="lazy">
 <span class="card-badge-category">${set.category}</span>
 <span class="card-badge-price">Ksh ${set.price.toLocaleString()}</span>
 <div class="card-quick-actions">
 <button class="action-circle-btn" onclick="event.stopPropagation(); toggleLike('${set.id}')" title="Like">
 <i class="fa-heart ${isLiked(set.id) ? 'fa-solid' : 'fa-regular'}" style="${isLiked(set.id) ? 'color: #ff4d6d' : ''}"></i>
 </button>
 <button class="action-circle-btn" onclick="event.stopPropagation(); downloadImage('${set.id}')" title="Download Image">
 <i class="fa-solid fa-download"></i>
 </button>
 <button class="action-circle-btn" onclick="event.stopPropagation(); shareSet('${set.id}')" title="Share Look">
 <i class="fa-solid fa-arrow-up-right-from-square"></i>
 </button>
 </div>
 </div>
 <div class="card-content">
 <h3 class="card-title">${set.title}</h3>
 <p class="card-style-sub">${set.style}</p>
 <div style="font-size: 0.78rem; color: var(--gold-light); font-weight: 600; margin-top: 2px;">
 30% Deposit: Ksh ${depositAmount.toLocaleString()}
 </div>
 <div class="card-tags-list">
 ${(set.tags || []).map(tag => `<span class="tag-pill">#${tag}</span>`).join('')}
 </div>
 <div class="card-footer-btns">
 <button type="button" class="btn-book-look" onclick="triggerDepositBooking('${set.id}')" style="background: rgba(212, 163, 115, 0.2); border-color: var(--border-gold);">
 <i class="fa-solid fa-credit-card"></i> Pay 30% (Ksh ${depositAmount.toLocaleString()})
 </button>
 <a href="${getWhatsAppBookingLink(set)}" target="_blank" class="action-circle-btn" style="border-radius: var(--radius-md); width: 44px; height: 38px;" title="Chat on WhatsApp">
 <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem; color: #25d366;"></i>
 </a>
 </div>
 </div>
 </div>
 `}).join('');

 // Trigger tilt listener refresh
 if (window.effectsEngine && window.effectsEngine.refreshTilt) {
 window.effectsEngine.refreshTilt();
 }
}

function triggerDepositBooking(id) {
 const set = allSets.find(s => s.id === id);
 if (set && window.equityPayment) {
 window.equityPayment.openPaymentModal(set);
 }
}

function downloadImage(id) {
 const set = allSets.find(s => s.id === id);
 if (!set) return;
 const a = document.createElement('a');
 a.href = set.imageUrl;
 a.download = `${set.title.replace(/\s+/g, '-').toLowerCase()}-aura-nails.jpg`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 showToast('Downloading image...');
}

function initFilterTabs() {
 const buttons = document.querySelectorAll('.service-list-item[data-category]');
 buttons.forEach(btn => {
 btn.addEventListener('click', () => {
 buttons.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 currentCategory = btn.dataset.category || 'all';
 
 // Scroll down a bit to the gallery so user sees the change
 document.getElementById('gallery-grid').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
 
 renderGallery();
 });
 });
}

function initSearch() {
 const input = document.getElementById('gallery-search');
 if (input) {
 input.addEventListener('input', (e) => {
 currentSearchQuery = e.target.value.trim();
 renderGallery();
 });
 }
}

/* ==========================================================================
 INSPIRATION VAULT RENDER
 ========================================================================== */
function renderInspoVault() {
 const container = document.getElementById('inspo-scroll');
 if (!container) return;

 container.innerHTML = INSPO_ITEMS.map(item => `
 <div class="inspo-card tilt-card" onclick="bookInspoLook('${item.category}', '${item.style}')">
 <div class="inspo-img-wrap">
 <img src="${item.img}" alt="${item.style}" loading="lazy">
 </div>
 <div class="inspo-meta">
 <div class="inspo-category">${item.category}</div>
 <div class="inspo-style">${item.style}</div>
 </div>
 </div>
 `).join('');
}

function bookInspoLook(category, style) {
 const message = encodeURIComponent(`Hi Aura Nails Hub! I saw the inspiration look "${style}" (${category}) on your site and would like to recreate this style with a 30% commitment deposit.`);
 window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
}

/* ==========================================================================
 IMAGE UPLOAD & COMPRESSION ENGINE
 ========================================================================== */
function initUploadModal() {
 const modal = document.getElementById('upload-modal');
 const openBtns = document.querySelectorAll('.btn-open-upload');
 const closeBtn = document.getElementById('close-upload-modal');
 const dropzone = document.getElementById('dropzone');
 const fileInput = document.getElementById('file-input');
 const previewBox = document.getElementById('image-preview');
 const previewImg = document.getElementById('preview-img');
 const removeImgBtn = document.getElementById('remove-img-btn');
 const form = document.getElementById('upload-form');

 if (!modal) return;

 openBtns.forEach(btn => btn.addEventListener('click', () => {
 if (!checkAdminPass()) {
 showToast('Access denied. Admin credentials required to upload.');
 return;
 }
 modal.classList.add('active');
 }));

 closeBtn?.addEventListener('click', () => {
 modal.classList.remove('active');
 resetUploadForm();
 });

 modal.addEventListener('click', (e) => {
 if (e.target === modal) {
 modal.classList.remove('active');
 resetUploadForm();
 }
 });

 // File input selection
 dropzone?.addEventListener('click', () => fileInput?.click());

 fileInput?.addEventListener('change', (e) => {
 const file = e.target.files[0];
 if (file) handleImageFile(file);
 });

 // Drag & Drop
 dropzone?.addEventListener('dragover', (e) => {
 e.preventDefault();
 dropzone.classList.add('dragover');
 });

 dropzone?.addEventListener('dragleave', () => {
 dropzone.classList.remove('dragover');
 });

 dropzone?.addEventListener('drop', (e) => {
 e.preventDefault();
 dropzone.classList.remove('dragover');
 if (e.dataTransfer.files.length) {
 handleImageFile(e.dataTransfer.files[0]);
 }
 });

 removeImgBtn?.addEventListener('click', (e) => {
 e.stopPropagation();
 currentSelectedImageBase64 = null;
 if (fileInput) fileInput.value = '';
 previewBox.style.display = 'none';
 dropzone.querySelector('.dropzone-icon').style.display = 'block';
 dropzone.querySelector('.dropzone-text').style.display = 'block';
 });

 // Handle Form Submit
 form?.addEventListener('submit', async (e) => {
 e.preventDefault();

 if (!currentSelectedImageBase64) {
 showToast("Please choose or drop an image for the set.");
 return;
 }

 const submitBtn = form.querySelector('button[type="submit"]');
 const originalText = submitBtn.innerHTML;
 submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Uploading Set...`;
 submitBtn.disabled = true;

 try {
 const title = document.getElementById('set-title').value.trim();
 const category = document.getElementById('set-category').value;
 const style = document.getElementById('set-style').value.trim();
 const price = Number(document.getElementById('set-price').value) || 1000;
 const description = document.getElementById('set-desc').value.trim();
 const tags = document.getElementById('set-tags').value;

 const newSet = await window.firebaseManager.uploadSet({
 title,
 category,
 style,
 price,
 description,
 imageUrl: currentSelectedImageBase64,
 tags
 });

 allSets.unshift(newSet);
 renderGallery();

 modal.classList.remove('active');
 resetUploadForm();
 showToast('Set successfully published to Aura Nails Hub!');

 // Auto-save Nail of the Week if checkbox was checked
 const notwChecked = document.getElementById('notw-checkbox')?.checked;
 if (notwChecked) {
  const notwData = { title, category, setId: newSet.id, updatedAt: new Date().toISOString() };
  localStorage.setItem('aura-notw', JSON.stringify(notwData));
  const titleEl = document.getElementById('notw-title');
  const catEl = document.getElementById('notw-cat');
  if (titleEl) titleEl.textContent = title;
  if (catEl) catEl.textContent = category;
  // Wire the view look link to the specific set
  const viewLink = document.querySelector('.notw-cta');
  if (viewLink) {
   viewLink.href = '#portfolio';
   viewLink.dataset.setId = newSet.id;
  }
  showToast('Weekly feature updated to: ' + title);
 }

 // Scroll to gallery
 const gallerySection = document.getElementById('portfolio');
 if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });

 } catch (err) {
 console.error("Upload error:", err);
 showToast("Failed to upload set. Check console for details.");
 } finally {
 submitBtn.innerHTML = originalText;
 submitBtn.disabled = false;
 }
 });
}

function handleImageFile(file) {
 if (!file.type.startsWith('image/')) {
 showToast("Please upload a valid image file.");
 return;
 }

 const reader = new FileReader();
 reader.onload = (event) => {
 // Compress image using canvas
 const img = new Image();
 img.src = event.target.result;
 img.onload = () => {
 const canvas = document.createElement('canvas');
 const MAX_WIDTH = 1200;
 const scale = Math.min(1, MAX_WIDTH / img.width);
 canvas.width = img.width * scale;
 canvas.height = img.height * scale;

 const ctx = canvas.getContext('2d');
 ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

 currentSelectedImageBase64 = canvas.toDataURL('image/jpeg', 0.85);

 // Update preview
 const previewBox = document.getElementById('image-preview');
 const previewImg = document.getElementById('preview-img');
 const dropzone = document.getElementById('dropzone');

 if (previewBox && previewImg && dropzone) {
 previewImg.src = currentSelectedImageBase64;
 previewBox.style.display = 'block';
 dropzone.querySelector('.dropzone-icon').style.display = 'none';
 dropzone.querySelector('.dropzone-text').style.display = 'none';
 }
 };
 };
 reader.readAsDataURL(file);
}

function resetUploadForm() {
 const form = document.getElementById('upload-form');
 if (form) form.reset();
 currentSelectedImageBase64 = null;
 const previewBox = document.getElementById('image-preview');
 const dropzone = document.getElementById('dropzone');
 if (previewBox) previewBox.style.display = 'none';
 if (dropzone) {
 dropzone.querySelector('.dropzone-icon').style.display = 'block';
 dropzone.querySelector('.dropzone-text').style.display = 'block';
 }
}

/* ==========================================================================
 LIGHTBOX MODAL
 ========================================================================== */
function initLightboxModal() {
 const modal = document.getElementById('lightbox-modal');
 const closeBtn = document.getElementById('close-lightbox-modal');
 const payDepositBtn = document.getElementById('lightbox-pay-deposit-btn');

 if (!modal) return;

 closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
 modal.addEventListener('click', (e) => {
 if (e.target === modal) modal.classList.remove('active');
 });

 payDepositBtn?.addEventListener('click', () => {
 if (activeLightboxSet && window.equityPayment) {
 modal.classList.remove('active');
 window.equityPayment.openPaymentModal(activeLightboxSet);
 }
 });
}

function openLightbox(id) {
 const set = allSets.find(s => s.id === id);
 if (!set) return;

 activeLightboxSet = set;
 const modal = document.getElementById('lightbox-modal');
 if (!modal) return;

 document.getElementById('lightbox-img').src = set.imageUrl;
 document.getElementById('lightbox-title').textContent = set.title;
 document.getElementById('lightbox-category').textContent = set.category;
 document.getElementById('lightbox-style').textContent = set.style;
 document.getElementById('lightbox-price').textContent = `Ksh ${set.price.toLocaleString()}`;
 document.getElementById('lightbox-desc').textContent = set.description || "Exclusive bespoke nail styling by Denis at Aura Nails Hub Embu.";
 
 const tagsContainer = document.getElementById('lightbox-tags');
 if (tagsContainer) {
 tagsContainer.innerHTML = (set.tags || []).map(t => `<span class="tag-pill">#${t}</span>`).join('');
 }

 const depositBtn = document.getElementById('lightbox-pay-deposit-btn');
 if (depositBtn) {
 const deposit = Math.ceil(set.price * 0.3);
 depositBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Book with 30% Deposit (Ksh ${deposit.toLocaleString()})`;
 }

 const bookBtn = document.getElementById('lightbox-book-btn');
 if (bookBtn) {
 bookBtn.href = getWhatsAppBookingLink(set);
 }

 modal.classList.add('active');
}

function getWhatsAppBookingLink(set) {
 const deposit = Math.ceil(set.price * 0.3);
 const message = encodeURIComponent(`Hi Aura Nails Hub! I would love to book the "${set.title}" look (${set.category} - Ksh ${set.price}) with a 30% deposit (Ksh ${deposit}). Are you available for an appointment in Embu?`);
 return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

/* ==========================================================================
 PRICE ESTIMATOR & SERVICE CALCULATOR
 ========================================================================== */
function initPriceCalculator() {
 const calcCard = document.querySelector('.calculator-card');
 if (!calcCard) return;

 let basePrice = 400; // Gel Polish natural
 let extensionPrice = 0;
 let artPrice = 0;
 let addOnPrice = 0;

 let baseName = "Gel Polish (Natural Nails)";
 let extName = "No Extension";
 let artName = "Minimal / Single Tone";

 function updateCalculator() {
 const total = basePrice + extensionPrice + artPrice + addOnPrice;
 const deposit = Math.ceil(total * 0.3);

 document.getElementById('calc-total').textContent = `Ksh ${total.toLocaleString()}`;
 document.getElementById('summary-base').textContent = `Ksh ${basePrice.toLocaleString()}`;
 document.getElementById('summary-ext').textContent = `Ksh ${extensionPrice.toLocaleString()}`;
 document.getElementById('summary-art').textContent = `Ksh ${artPrice.toLocaleString()}`;

 const bookBtn = document.getElementById('calc-book-btn');
 if (bookBtn) {
 bookBtn.innerHTML = `<i class="fa-solid fa-credit-card"></i> Book Custom Set (30% Deposit: Ksh ${deposit.toLocaleString()})`;
 bookBtn.onclick = (e) => {
 e.preventDefault();
 if (window.equityPayment) {
 window.equityPayment.openPaymentModal({
 id: 'custom_calc',
 title: `Custom ${baseName}`,
 category: `${extName} • ${artName}`,
 imageUrl: 'nails4.png.png',
 price: total
 });
 }
 };
 }
 }

 // Base Selection
 document.querySelectorAll('[data-calc-group="base"]').forEach(btn => {
 btn.addEventListener('click', () => {
 document.querySelectorAll('[data-calc-group="base"]').forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 basePrice = Number(btn.dataset.price);
 baseName = btn.dataset.name;
 updateCalculator();
 });
 });

 // Extension Selection
 document.querySelectorAll('[data-calc-group="extension"]').forEach(btn => {
 btn.addEventListener('click', () => {
 document.querySelectorAll('[data-calc-group="extension"]').forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 extensionPrice = Number(btn.dataset.price);
 extName = btn.dataset.name;
 updateCalculator();
 });
 });

 // Art Selection
 document.querySelectorAll('[data-calc-group="art"]').forEach(btn => {
 btn.addEventListener('click', () => {
 document.querySelectorAll('[data-calc-group="art"]').forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 artPrice = Number(btn.dataset.price);
 artName = btn.dataset.name;
 updateCalculator();
 });
 });

 updateCalculator();
}

/* ==========================================================================
 PAYSTACK PAYMENT MODAL LISTENERS
 ========================================================================== */
function initPaymentModalListeners() {
 const modal = document.getElementById('payment-modal');
 const closeBtn = document.getElementById('close-payment-modal');
 const tabStk = document.getElementById('tab-btn-stk');
 const tabPaybill = document.getElementById('tab-btn-paybill');
 const paybillSection = document.getElementById('paybill-info-section');
 const submitLabel = document.getElementById('pay-submit-label');
 const form = document.getElementById('booking-payment-form');

 if (!modal) return;

 closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
 modal.addEventListener('click', (e) => {
 if (e.target === modal) modal.classList.remove('active');
 });

 let currentPayMode = 'stk';

 tabStk?.addEventListener('click', () => {
 tabStk.classList.add('active');
 tabPaybill.classList.remove('active');
 paybillSection.style.display = 'none';
 submitLabel.textContent = 'Pay with Paystack';
 currentPayMode = 'stk';
 });

 tabPaybill?.addEventListener('click', () => {
 tabPaybill.classList.add('active');
 tabStk.classList.remove('active');
 paybillSection.style.display = 'block';
 submitLabel.textContent = 'Confirm Bank Transfer';
 currentPayMode = 'paybill';
 });

 form?.addEventListener('submit', async (e) => {
 e.preventDefault();

 const name = document.getElementById('client-name').value.trim();
 const phone = document.getElementById('client-phone').value.trim();
 const datetime = document.getElementById('client-datetime').value.trim();
 const location = document.getElementById('client-location').value.trim();

 if (currentPayMode === 'stk') {
 // Trigger Paystack popup checkout
 await window.paystackPayment.triggerPaystackPopup(phone, name, datetime, location);
 } else {
 const txCode = document.getElementById('tx-confirm-code').value.trim();
 if (!txCode) {
 showToast('Please enter your Paystack / Bank transaction reference.');
 return;
 }
 await window.paystackPayment.completeManualTransfer(txCode, name, phone, datetime, location);
 }
 });
}

/* ==========================================================================
 FIREBASE CONFIG MODAL
 ========================================================================== */
function initFirebaseModal() {
 const modal = document.getElementById('firebase-modal');
 const openBtn = document.getElementById('btn-open-firebase');
 const closeBtn = document.getElementById('close-firebase-modal');
 const form = document.getElementById('firebase-config-form');

 if (!modal) return;

 openBtn?.addEventListener('click', () => {
 const config = window.firebaseManager.getConfig();
 document.getElementById('fb-api-key').value = config.apiKey || '';
 document.getElementById('fb-project-id').value = config.projectId || '';
 document.getElementById('fb-storage-bucket').value = config.storageBucket || '';
 document.getElementById('fb-app-id').value = config.appId || '';
 modal.classList.add('active');
 });

 closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
 modal.addEventListener('click', (e) => {
 if (e.target === modal) modal.classList.remove('active');
 });

 form?.addEventListener('submit', (e) => {
 e.preventDefault();
 const config = {
 apiKey: document.getElementById('fb-api-key').value.trim(),
 projectId: document.getElementById('fb-project-id').value.trim(),
 storageBucket: document.getElementById('fb-storage-bucket').value.trim(),
 appId: document.getElementById('fb-app-id').value.trim()
 };

 window.firebaseManager.saveConfig(config);
 showToast(" Firebase settings saved! Reloading...");
 setTimeout(() => window.location.reload(), 1200);
 });
}

/* ==========================================================================
 MOBILE NAV T  ========================================================================== */
function initMobileNav() {
 const toggle = document.querySelector('.mobile-menu-btn');
 const navMenu = document.querySelector('.nav-menu');
 const header = document.querySelector('.site-header');
 if (!toggle || !navMenu) return;

 function openMenu() {
  navMenu.classList.add('mobile-open');
  toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  toggle.setAttribute('aria-expanded', 'true');
 }

 function closeMenu() {
  navMenu.classList.remove('mobile-open');
  toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  toggle.setAttribute('aria-expanded', 'false');
 }

 toggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.contains('mobile-open');
  isOpen ? closeMenu() : openMenu();
 });

 // Close on any nav link click
 navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
 });

 // Close on outside tap
 document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) closeMenu();
 });
}

/* ==========================================================================
 UTILITY HELPERS (LIKES, SHARE, TOASTS)
 ========================================================================== */
function isLiked(id) {
 try {
 const liked = JSON.parse(localStorage.getItem('auranails_liked') || '[]');
 return liked.includes(id);
 } catch (e) {
 return false;
 }
}

function toggleLike(id) {
 try {
 let liked = JSON.parse(localStorage.getItem('auranails_liked') || '[]');
 if (liked.includes(id)) {
 liked = liked.filter(item => item !== id);
 showToast("Removed from favorites");
 } else {
 liked.push(id);
 showToast(" Added to your favorites!");
 }
 localStorage.setItem('auranails_liked', JSON.stringify(liked));
 renderGallery();
 } catch (e) {
 console.error(e);
 }
}

function shareSet(id) {
 const set = allSets.find(s => s.id === id);
 if (!set) return;

 if (navigator.share) {
 navigator.share({
 title: `Aura Nails Hub - ${set.title}`,
 text: `Check out this nail set "${set.title}" by Aura Nails Hub in Embu!`,
 url: window.location.href
 }).catch(() => {});
 } else {
 navigator.clipboard.writeText(`${window.location.href}#portfolio`);
 showToast(" Link copied to clipboard!");
 }
}

function showToast(message) {
 let container = document.querySelector('.toast-container');
 if (!container) {
 container = document.createElement('div');
 container.className = 'toast-container';
 document.body.appendChild(container);
 }

 const toast = document.createElement('div');
 toast.className = 'toast';
 toast.innerHTML = `<span></span> <span>${message}</span>`;
 container.appendChild(toast);

 setTimeout(() => {
 toast.style.opacity = '0';
 toast.style.transform = 'translateY(20px)';
 setTimeout(() => toast.remove(), 300);
 }, 3200);
}

/* ==========================================================================
 SCROLL TO TOP BUTTON
 ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
 const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
 if (!scrollToTopBtn) return;

 window.addEventListener('scroll', () => {
 if (window.scrollY > 400) {
 scrollToTopBtn.classList.add('visible');
 } else {
 scrollToTopBtn.classList.remove('visible');
 }
 });

 scrollToTopBtn.addEventListener('click', () => {
 window.scrollTo({
 top: 0,
 behavior: 'smooth'
 });
 });
});

// Expose openLightbox globally for external scripts (e.g. premium.js NOTW strip)
window.openLightbox = openLightbox;

// Expose a live reference to allSets so premium.js NOTW can look up sets by title
Object.defineProperty(window, '__allSetsRef', {
  get: () => allSets,
  configurable: true
});

// Expose a gallery filter helper so NOTW "View Look" can filter by category
// when no specific setId is stored (e.g. manually entered weekly features)
window.filterGalleryByCategory = function(category) {
  if (!category) return;
  // Find the matching filter button and click it to trigger the existing filter logic
  const filterBtns = document.querySelectorAll('[data-category]');
  let matched = false;
  filterBtns.forEach(btn => {
    const btnCat = btn.dataset.category || '';
    if (
      category.toLowerCase().includes(btnCat.toLowerCase()) ||
      btnCat.toLowerCase().includes(category.toLowerCase().split(' ')[0])
    ) {
      btn.click();
      matched = true;
    }
  });
  // Fallback: just update currentCategory and re-render
  if (!matched) {
    currentCategory = 'all';
    renderGallery();
  }
};
