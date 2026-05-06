/* ===== DATA ===== */
const products = [
  {
    id: 1,
    name: "Midnight Blue",
    price: 349000,
    tag: "Woody Spicy",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 128,
    desc: "Aroma maskulin yang tajam dan segar, cocok untuk penggunaan malam hari atau acara formal.",
    notes: { top: "Bergamot", mid: "Sichuan Pepper", base: "Ambroxan" },
    longevity: "8-10 Jam",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
  },
  {
    id: 2,
    name: "Rose Velvet",
    price: 420000,
    tag: "Floral Sweet",
    badge: "New Arrival",
    rating: 4.8,
    reviews: 84,
    desc: "Sentuhan mawar yang lembut dipadu dengan vanilla hangat. Elegan dan sangat feminin.",
    notes: { top: "Damask Rose", mid: "Vanilla", base: "White Musk" },
    longevity: "6-8 Jam",
    img: "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?w=500",
  },
  {
    id: 3,
    name: "Oud Wood",
    price: 550000,
    tag: "Oriental Woody",
    badge: "Best Seller",
    rating: 5.0,
    reviews: 210,
    desc: "Kehangatan kayu gaharu langka yang eksotis. Pilihan untuk karakter yang kuat dan misterius.",
    notes: { top: "Cardamom", mid: "Agarwood (Oud)", base: "Sandalwood" },
    longevity: "12+ Jam",
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
  },
  {
    id: 4,
    name: "Ocean Mist",
    price: 299000,
    tag: "Aquatic Fresh",
    badge: "",
    rating: 4.7,
    reviews: 67,
    desc: "Sensasi kesegaran laut yang menenangkan. Sangat cocok untuk aktivitas outdoor di siang hari.",
    notes: { top: "Sea Salt", mid: "Sage", base: "Grapefruit" },
    longevity: "5-7 Jam",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500",
  },
  {
    id: 5,
    name: "Amber Noir",
    price: 480000,
    tag: "Oriental Woody",
    badge: "New Arrival",
    rating: 4.9,
    reviews: 43,
    desc: "Perpaduan amber oriental dan musc hitam yang memukau. Sensual dan mewah.",
    notes: { top: "Black Pepper", mid: "Amber", base: "Dark Musk" },
    longevity: "10-12 Jam",
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500",
  },
  {
    id: 6,
    name: "Cherry Blossom",
    price: 310000,
    tag: "Floral Sweet",
    badge: "",
    rating: 4.6,
    reviews: 55,
    desc: "Aroma bunga sakura yang lembut dan menyegarkan. Cocok untuk penggunaan sehari-hari.",
    notes: { top: "Lychee", mid: "Cherry Blossom", base: "Soft Musk" },
    longevity: "5-7 Jam",
    img: "https://images.unsplash.com/photo-1588776814546-1ffeddb3f1a8?w=500",
  },
];

const testimonials = [
  {
    name: "Rian Adrianto",
    text: "Wanginya tahan lama banget, Midnight Blue beneran bikin PD seharian!",
    stars: 5,
  },
  {
    name: "Sarah Clarissa",
    text: "Rose Velvet lembut banget aromanya. Gak bikin pusing. Packagingnya mewah.",
    stars: 5,
  },
  {
    name: "Budi Santoso",
    text: "Oud Wood pilihan terbaik buat acara formal. Banyak yang nanya parfum apa haha.",
    stars: 5,
  },
  {
    name: "Dinda Ayu",
    text: "Ocean Mist cocok banget buat aku yang aktif. Wanginya fresh dan clean!",
    stars: 4,
  },
];

const adminList = ["6282223840304", "6282339175595"];
let adminIdx = 0;

/* ===== STATE ===== */
let cart = {}; // { id: qty }
let wishlist = [];
let orders = [];
let currentUser = null;
let currentFilter = "all";

/* ===== STORAGE HELPERS ===== */
const LS = {
  get: (k) => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

function getUsers() {
  return LS.get("decane_users") || {};
}
function saveUsers(u) {
  LS.set("decane_users", u);
}
function loadUserData() {
  if (!currentUser) return;
  cart = LS.get("decane_cart_" + currentUser.email) || {};
  wishlist = LS.get("decane_wish_" + currentUser.email) || [];
  orders = LS.get("decane_orders_" + currentUser.email) || [];
}
function saveUserData() {
  if (!currentUser) return;
  LS.set("decane_cart_" + currentUser.email, cart);
  LS.set("decane_wish_" + currentUser.email, wishlist);
  LS.set("decane_orders_" + currentUser.email, orders);
}

/* ===== AUTH ===== */
function switchTab(tab) {
  document
    .querySelectorAll(".auth-tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".auth-tab")
    [tab === "login" ? 0 : 1].classList.add("active");
  document
    .getElementById("loginTab")
    .classList.toggle("hidden", tab !== "login");
  document
    .getElementById("registerTab")
    .classList.toggle("hidden", tab !== "register");
}

function togglePass(id, btn) {
  const inp = document.getElementById(id);
  const isPass = inp.type === "password";
  inp.type = isPass ? "text" : "password";
  btn.innerHTML = isPass
    ? '<i class="far fa-eye-slash"></i>'
    : '<i class="far fa-eye"></i>';
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 3000);
}
function showSucc(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
}

function doRegister() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const phone = document.getElementById("regPhone").value.trim();
  const pass = document.getElementById("regPass").value;
  if (!name || !email || !pass)
    return showErr("regError", "Semua field wajib diisi!");
  if (!email.includes("@"))
    return showErr("regError", "Format email tidak valid!");
  if (pass.length < 6)
    return showErr("regError", "Password minimal 6 karakter!");
  const users = getUsers();
  if (users[email]) return showErr("regError", "Email sudah terdaftar!");
  users[email] = {
    name,
    email,
    phone,
    pass,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  showSucc("regSuccess", "Akun berhasil dibuat! Silakan masuk.");
  setTimeout(() => switchTab("login"), 1500);
}

function doLogin() {
  const email = document
    .getElementById("loginEmail")
    .value.trim()
    .toLowerCase();
  const pass = document.getElementById("loginPass").value;
  if (!email || !pass) return showErr("loginError", "Isi email dan password!");
  const users = getUsers();
  if (!users[email] || users[email].pass !== pass)
    return showErr("loginError", "Email atau password salah!");
  currentUser = users[email];
  enterApp();
}

function doGuest() {
  currentUser = {
    name: "Tamu",
    email: "guest@decane.id",
    phone: "",
    isGuest: true,
  };
  enterApp();
}

// ✅ SESUDAH — pakai modal yang sudah ada
function doLogout() {
  openModal(
    "confirm",
    `
    <div style="text-align:center;padding:16px 0 8px;">
      <div style="width:56px;height:56px;background:rgba(224,88,88,0.1);border-radius:50%;
        display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <i class="fas fa-sign-out-alt" style="color:var(--danger);font-size:22px;"></i>
      </div>
      <h3 class="playfair" style="font-size:20px;margin-bottom:8px;color:var(--ivory);">Yakin ingin keluar?</h3>
      <p style="font-size:13px;color:var(--gray);margin-bottom:24px;">Sesi Anda akan diakhiri.</p>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-outline" onclick="closeModal()" style="flex:1;">Batal</button>
        <button class="btn btn-dark" onclick="confirmLogout()" 
          style="flex:1;border-color:rgba(224,88,88,0.3);color:var(--danger);">Keluar</button>
      </div>
    </div>
  `,
  );
}

function confirmLogout() {
  closeModal();
  saveUserData();
  currentUser = null;
  cart = {};
  wishlist = [];
  orders = [];
  document.getElementById("authPage").classList.add("show");
  document.getElementById("mainApp").classList.add("hidden");
  switchPage("home");
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPass").value = "";
}

function enterApp() {
  loadUserData();
  document.getElementById("authPage").classList.remove("show");
  document.getElementById("mainApp").classList.remove("hidden");
  updateCartBadge();
  renderProducts(products);
  renderTestimonials();
  updateProfile();
}

/* ===== NAVIGATION ===== */
function switchPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById(page + "Page").classList.add("active");
  document.getElementById("nav-" + page).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ tambahkan ini
  if (page === "wishlist") renderWishlist();
  if (page === "cart") renderCart();
  if (page === "profile") updateProfile();
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("productCount");
  if (!grid) return;
 
  if (countEl) countEl.textContent = list.length + " produk";
 
  if (!list.length) {
    grid.innerHTML =
      '<p style="color:var(--gray);font-size:13px;grid-column:span 2;text-align:center;padding:30px 0;">Produk tidak ditemukan</p>';
    return;
  }
  grid.innerHTML = list
    .map((p) => {
      const inWish = wishlist.includes(p.id);
      const badgeClass = p.badge === "New Arrival" ? "new" : "";
      return `<div class="card">
      <div class="card-img-wrap" onclick="viewDetail(${p.id})">
        <img src="${p.img}" class="card-img" loading="lazy">
        ${p.badge ? `<div class="card-badge ${badgeClass}">${p.badge}</div>` : ''}
        <button class="wishlist-btn ${inWish ? 'active' : ''}"
          onclick="event.stopPropagation(); toggleWish(${p.id}, this)">
          <i class="${inWish ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </div>
      <div class="card-info" onclick="viewDetail(${p.id})">
        <span class="card-tag">${p.tag}</span>
        <div class="card-title">${p.name}</div>
        <div class="card-bottom">
          <div class="card-price">Rp ${p.price.toLocaleString('id-ID')}</div>
          <div class="card-rating"><i class="fas fa-star"></i> ${p.rating} <span>(${p.reviews})</span></div>
        </div>
      </div>
    </div>`;
    /* ✅ FIX 1: baris di atas pakai backtick ` bukan tanda kutip ' */
    })
    .join("");
}
 
function renderTestimonials() {
  const area = document.getElementById("testiArea");
  if (!area) return;
  area.innerHTML = testimonials
    .map((t) => {
      const stars = '<i class="fas fa-star"></i>'.repeat(t.stars);
      const initials = t.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
      return `<div class="testi-card">
      <div style="display:flex;align-items:center;margin-bottom:10px;">
        <div class="testi-avatar">${initials}</div>
        <div><div class="stars">${stars}</div><span style="font-size:12px;font-weight:600;">${t.name}</span></div>
      </div>
      <p style="font-size:11px;color:var(--gray);font-style:italic;">"${t.text}"</p>
    </div>`;
    })
    .join("");
}
 
/* ===== FILTER ===== */
function filterChip(el, val) {
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  currentFilter = val;
  let filtered = products;
  if (val !== "all") {
    if (val === "Best Seller" || val === "New Arrival")
      filtered = products.filter((p) => p.badge === val);
    else filtered = products.filter((p) => p.tag === val);
  }
  renderProducts(filtered);
}
 
function search(k) {
  const q = k.toLowerCase();
  renderProducts(
    products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
    )
  );
}
 
/* ===== DETAIL MODAL ===== */
function viewDetail(id) {
  const p = products.find((i) => i.id === id);
  const inWish = wishlist.includes(p.id);
  openModal(
    "detail",
    `
    <button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <img src="${p.img}" class="detail-img">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
      <span class="card-tag">${p.tag}</span>
      <button onclick="toggleWishModal(${p.id}, this)" style="background:none;border:none;cursor:pointer;font-size:18px;color:${inWish ? "var(--danger)" : "#ccc"}">
        <i class="${inWish ? "fas" : "far"} fa-heart"></i>
      </button>
    </div>
    <h2 class="playfair" style="font-size:22px;margin-bottom:8px;">${p.name}</h2>
    <div class="card-rating" style="font-size:12px;margin-bottom:10px;">
      ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))} <b>${p.rating}</b> <span>(${p.reviews} ulasan)</span>
    </div>
    <p style="font-size:12px;color:var(--gray);line-height:1.7;">${p.desc}</p>
    <div class="notes-grid">
      <div class="note-item"><div class="note-label">Top Note</div><i class="fas fa-leaf"></i>${p.notes.top}</div>
      <div class="note-item"><div class="note-label">Mid Note</div><i class="fas fa-wind"></i>${p.notes.mid}</div>
      <div class="note-item"><div class="note-label">Base Note</div><i class="fas fa-tint"></i>${p.notes.base}</div>
    </div>
    <div style="background:var(--note-bg);padding:12px 14px;border-radius:10px;font-size:12px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
      <i class="fas fa-clock" style="color:var(--gold);"></i>
      <span>Ketahanan: <b>${p.longevity}</b></span>
      <span style="margin-left:auto;color:var(--gold);font-weight:700;">Rp ${p.price.toLocaleString("id-ID")}</span>
    </div>
    <button class="btn btn-dark" onclick="addToCart(${p.id}); closeModal();">
      <i class="fas fa-shopping-bag" style="margin-right:8px;"></i>ADD TO BAG
    </button>
  `
  );
}
 
/* ===== WISHLIST ===== */
function toggleWish(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.classList.add("active");
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast("Ditambahkan ke Wishlist ❤️");
  } else {
    wishlist.splice(idx, 1);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast("Dihapus dari Wishlist");
  }
  saveUserData();
}
 
function toggleWishModal(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.style.color = "var(--danger)";
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast("Ditambahkan ke Wishlist ❤️");
  } else {
    wishlist.splice(idx, 1);
    btn.style.color = "#ccc";
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast("Dihapus dari Wishlist");
  }
  saveUserData();
  renderProducts(products);
}
 
function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  const list = products.filter((p) => wishlist.includes(p.id));
  if (!list.length) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  grid.innerHTML = list
    .map(
      (p) => `
    <div class="card">
      <div class="card-img-wrap" onclick="viewDetail(${p.id})">
        <img src="${p.img}" class="card-img" loading="lazy">
        <button class="wishlist-btn active" onclick="event.stopPropagation(); toggleWish(${p.id}, this); renderWishlist();">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="card-info" onclick="viewDetail(${p.id})">
        <span class="card-tag">${p.tag}</span>
        <div class="card-title">${p.name}</div>
        <div class="card-price">Rp ${p.price.toLocaleString("id-ID")}</div>
      </div>
    </div>`
    )
    .join("");
}

function renderTestimonials() {
  const area = document.getElementById("testiArea");
  if (!area) return;
  area.innerHTML = testimonials
    .map((t) => {
      const stars = '<i class="fas fa-star"></i>'.repeat(t.stars);
      const initials = t.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
      return `<div class="testi-card">
      <div style="display:flex;align-items:center;margin-bottom:10px;">
        <div class="testi-avatar">${initials}</div>
        <div><div class="stars">${stars}</div><span style="font-size:12px;font-weight:600;">${t.name}</span></div>
      </div>
      <p style="font-size:11px;color:var(--gray);font-style:italic;">"${t.text}"</p>
    </div>`;
    })
    .join("");
}

/* ===== FILTER ===== */
function filterChip(el, val) {
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  currentFilter = val;
  let filtered = products;
  if (val !== "all") {
    if (val === "Best Seller" || val === "New Arrival")
      filtered = products.filter((p) => p.badge === val);
    else filtered = products.filter((p) => p.tag === val);
  }
  renderProducts(filtered);
}

function search(k) {
  const q = k.toLowerCase();
  renderProducts(
    products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q),
    ),
  );
}

/* ===== DETAIL MODAL ===== */
function viewDetail(id) {
  const p = products.find((i) => i.id === id);
  const inWish = wishlist.includes(p.id);
  const qty = cart[p.id] || 0;
  openModal(
    "detail",
    `
    <button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <img src="${p.img}" class="detail-img">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
      <span class="card-tag">${p.tag}</span>
      <button onclick="toggleWishModal(${p.id}, this)" style="background:none;border:none;cursor:pointer;font-size:18px;color:${inWish ? "var(--danger)" : "#ccc"}">
        <i class="${inWish ? "fas" : "far"} fa-heart"></i>
      </button>
    </div>
    <h2 class="playfair" style="font-size:22px;margin-bottom:8px;">${p.name}</h2>
    <div class="card-rating" style="font-size:12px;margin-bottom:10px;">
      ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))} <b>${p.rating}</b> <span>(${p.reviews} ulasan)</span>
    </div>
    <p style="font-size:12px;color:var(--gray);line-height:1.7;">${p.desc}</p>
    <div class="notes-grid">
      <div class="note-item"><div class="note-label">Top Note</div><i class="fas fa-leaf"></i>${p.notes.top}</div>
      <div class="note-item"><div class="note-label">Mid Note</div><i class="fas fa-wind"></i>${p.notes.mid}</div>
      <div class="note-item"><div class="note-label">Base Note</div><i class="fas fa-tint"></i>${p.notes.base}</div>
    </div>
    <div style="background:#fdf8e6;padding:12px 14px;border-radius:10px;font-size:12px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
      <i class="fas fa-clock" style="color:var(--gold-dark);"></i>
      <span>Ketahanan: <b>${p.longevity}</b></span>
      <span style="margin-left:auto;color:var(--gold-dark);font-weight:700;">Rp ${p.price.toLocaleString("id-ID")}</span>
    </div>
    <button class="btn btn-dark" onclick="addToCart(${p.id}); closeModal();">
      <i class="fas fa-shopping-bag" style="margin-right:8px;"></i>ADD TO BAG
    </button>
  `,
  );
}

/* ===== WISHLIST ===== */
function toggleWish(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.classList.add("active");
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast("Ditambahkan ke Wishlist ❤️");
  } else {
    wishlist.splice(idx, 1);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast("Dihapus dari Wishlist");
  }
  saveUserData();
}

function toggleWishModal(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.style.color = "var(--danger)";
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast("Ditambahkan ke Wishlist ❤️");
  } else {
    wishlist.splice(idx, 1);
    btn.style.color = "#ccc";
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast("Dihapus dari Wishlist");
  }
  saveUserData();
  renderProducts(products);
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  const list = products.filter((p) => wishlist.includes(p.id));
  if (!list.length) {
    grid.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  grid.innerHTML = list
    .map(
      (p) => `
    <div class="card">
      <div class="card-img-wrap" onclick="viewDetail(${p.id})">
        <img src="${p.img}" class="card-img" loading="lazy">
        <button class="wishlist-btn active" onclick="event.stopPropagation(); toggleWish(${p.id}, this); renderWishlist();">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="card-info" onclick="viewDetail(${p.id})">
        <span class="card-tag">${p.tag}</span>
        <div class="card-title">${p.name}</div>
        <div class="card-price">Rp ${p.price.toLocaleString("id-ID")}</div>
      </div>
    </div>`,
    )
    .join("");
}

/* ===== CART ===== */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartBadge();
  saveUserData();
  showToast("Ditambahkan ke Bag 🛍️");
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCartBadge();
  saveUserData();
  renderCart();
}

function updateCartBadge() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const badgeMobile = document.getElementById("cartBadge");
  const badgeNav = document.getElementById("cartBadgeNav");
  if (badgeMobile) {
    badgeMobile.textContent = total;
    badgeMobile.style.display = total > 0 ? "flex" : "none";
  }
  if (badgeNav) {
    badgeNav.textContent = total;
    badgeNav.style.display = total > 0 ? "inline-block" : "none";
  }
}

function openModal(type, html) {
  const modal = document.getElementById("appModal");
  const content = document.getElementById("modalContent");
  document.body.style.overflow = "hidden";
  // ✅ tambahkan 'confirm' di kondisi pertama
  if (["detail", "checkout", "confirm"].includes(type))
    content.innerHTML = html;
  else if (type === "orderHistory") renderOrderHistory(content);
  else if (type === "editProfile") renderEditProfile(content);
  else if (type === "alamat") renderAlamat(content);
  modal.classList.add("show");
}

function closeModal() {
  document.getElementById("appModal").classList.remove("show");
  document.body.style.overflow = "auto"; // tambahkan ini
}

function renderCart() {
  const con = document.getElementById("cartContainer");
  const items = Object.entries(cart).map(([id, qty]) => ({
    ...products.find((p) => p.id == id),
    qty,
  }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (!items.length) {
    con.innerHTML = `<div class="wishlist-empty"><i class="fas fa-shopping-bag" style="font-size:50px;color:#eee;display:block;margin-bottom:14px;"></i><p style="font-weight:600;">Bag Kosong</p><p style="font-size:12px;margin-top:6px;">Yuk tambahkan produk ke bag!</p><button class="btn btn-dark" onclick="switchPage('home')" style="margin-top:20px;max-width:200px;">BELANJA SEKARANG</button></div>`;
    return;
  }
  const itemsHtml = items
    .map(
      (i) => `
    <div class="cart-item">
      <img src="${i.img}" class="cart-item-img" onclick="viewDetail(${i.id})">
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:600;margin-bottom:2px;">${i.name}</div>
        <div style="font-size:11px;color:var(--gray);margin-bottom:8px;">${i.tag}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${i.id}, -1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
      <div style="font-weight:700;font-size:13px;">Rp ${(i.price * i.qty).toLocaleString("id-ID")}</div>
    </div>`,
    )
    .join("");

  con.innerHTML = `
    <h3 class="section-title">SHOPPING BAG</h3>
    ${itemsHtml}
    <div style="background:var(--light-gray);border-radius:14px;padding:16px;margin:20px 0;">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;">
        <span style="color:var(--gray);">Subtotal</span><span>Rp ${total.toLocaleString("id-ID")}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px;">
        <span style="color:var(--gray);">Ongkir</span><span style="color:var(--success);font-weight:600;">GRATIS</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;padding-top:10px;border-top:1px solid var(--border);">
        <span>TOTAL</span><span>Rp ${total.toLocaleString("id-ID")}</span>
      </div>
    </div>
    <div class="form-group">
      <label>Kode Promo</label>
      <div style="display:flex;gap:8px;">
        <input type="text" class="form-control" id="promoInput" placeholder="DECANE10" style="flex:1;">
        <button class="btn btn-outline" onclick="applyPromo()" style="width:auto;padding:12px 20px;">Pakai</button>
      </div>
    </div>
    <button class="btn btn-wa" onclick="openCheckoutForm(${total})"><i class="fab fa-whatsapp" style="margin-right:8px;"></i>CHECKOUT VIA WHATSAPP</button>
  `;
}

function applyPromo() {
  const code = document.getElementById("promoInput").value.toUpperCase();
  if (code === "DECANE10")
    showToast("🎉 Promo berhasil! Ongkir gratis diterapkan");
  else showToast("Kode promo tidak valid");
}

function openCheckoutForm(total) {
  const savedAddr = LS.get("decane_addr_" + (currentUser?.email || "")) || ""; // ✅ baca alamat yang disimpan
  openModal(
    "checkout",
    `
    <button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <h3 class="playfair" style="text-align:center;margin-bottom:20px;">DETAIL PENGIRIMAN</h3>
    <div class="form-group">
      <label>Nama Lengkap</label>
      <input type="text" class="form-control" id="custName" value="${currentUser && !currentUser.isGuest ? currentUser.name : ""}" placeholder="Nama penerima">
    </div>
    <div class="form-group">
      <label>No. HP (WhatsApp)</label>
      <input type="tel" class="form-control" id="custPhone" value="${currentUser && !currentUser.isGuest ? currentUser.phone || "" : ""}" placeholder="08xxxxxxxx">
    </div>
    <div class="form-group">
      <label>Alamat Lengkap</label>
      <textarea class="form-control" id="custAddr" rows="3" placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos"></textarea>
    </div>
    <div class="form-group">
      <label>Catatan (opsional)</label>
      <input type="text" class="form-control" id="custNote" placeholder="Contoh: jangan hubungi via telepon">
    </div>
    <div style="background:var(--light-gray);padding:12px 14px;border-radius:10px;font-size:12px;margin-bottom:18px;display:flex;justify-content:space-between;">
      <span>Total Pembayaran</span><span style="font-weight:700;">Rp ${total.toLocaleString("id-ID")}</span>
    </div>
    <button class="btn btn-wa" onclick="sendToWA(${total})"><i class="fab fa-whatsapp" style="margin-right:8px;"></i>KIRIM ORDER VIA WHATSAPP</button>
  `,
  );
}

function sendToWA(total) {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const addr = document.getElementById("custAddr").value.trim();
  const note = document.getElementById("custNote").value.trim();
  if (!name || !addr) return showToast("Lengkapi nama dan alamat!");

  const items = Object.entries(cart).map(([id, qty]) => {
    const p = products.find((pr) => pr.id == id);
    return `- ${p.name} x${qty} = Rp ${(p.price * qty).toLocaleString("id-ID")}`;
  });

  let msg = `*NEW ORDER - DECANE PARFUM* 🛍️\n\n`;
  msg += `*Nama:* ${name}\n*HP:* ${phone || "-"}\n*Alamat:* ${addr}\n`;
  if (note) msg += `*Catatan:* ${note}\n`;
  msg += `\n*Pesanan:*\n${items.join("\n")}`;
  msg += `\n\n*TOTAL: Rp ${total.toLocaleString("id-ID")}*\n_Terima kasih sudah belanja di Decane Parfum!_ ✨`;

  // Save order
  orders.push({
    id: Date.now(),
    items: Object.entries(cart).map(([id, qty]) => ({ id: parseInt(id), qty })),
    total,
    name,
    addr,
    status: "Pending",
    date: new Date().toLocaleDateString("id-ID"),
  });
  saveUserData();

  const admin = adminList[adminIdx % adminList.length];
  adminIdx++;
  window.open(
    `https://wa.me/${admin}?text=${encodeURIComponent(msg)}`,
    "_blank",
  );
  cart = {};
  updateCartBadge();
  saveUserData();
  closeModal();
  switchPage("home");
  showToast("Order berhasil dikirim! 🎉");
}

/* ===== PROFILE ===== */
function updateProfile() {
  if (!currentUser) return;
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("profileEmail").textContent = currentUser.isGuest
    ? "Mode Tamu"
    : currentUser.email;
}

/* ===== MODAL HELPERS ===== */
function openModal(type, html) {
  const modal = document.getElementById("appModal");
  const content = document.getElementById("modalContent");
  if (type === "detail" || type === "checkout") content.innerHTML = html;
  else if (type === "orderHistory") renderOrderHistory(content);
  else if (type === "editProfile") renderEditProfile(content);
  else if (type === "alamat") renderAlamat(content);
  modal.classList.add("show");
}

function closeModal() {
  document.getElementById("appModal").classList.remove("show");
}
document.getElementById("appModal").onclick = (e) => {
  if (e.target.id === "appModal") closeModal();
};

function renderOrderHistory(content) {
  const orderHtml = orders.length
    ? orders
        .slice()
        .reverse()
        .map((o) => {
          const names = o.items
            .map((i) => products.find((p) => p.id == i.id)?.name)
            .filter(Boolean)
            .join(", ");
          return `<div class="order-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:11px;color:var(--gray);">#${o.id}</span>
        <span class="order-status ${o.status === "Selesai" ? "status-done" : "status-pending"}">${o.status}</span>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${names}</div>
      <div style="font-size:11px;color:var(--gray);margin-bottom:8px;">${o.date}</div>
      <div style="font-weight:700;color:var(--gold);">Rp ${o.total.toLocaleString("id-ID")}</div>
    </div>`;
        })
        .join("")
    : '<div class="wishlist-empty"><i class="fas fa-box" style="font-size:40px;color:#eee;display:block;margin-bottom:10px;"></i><p>Belum ada pesanan</p></div>';
  content.innerHTML = `<button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <h3 class="playfair" style="text-align:center;margin-bottom:20px;">RIWAYAT PESANAN</h3>${orderHtml}`;
}

function renderEditProfile(content) {
  content.innerHTML = `
    <button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <h3 class="playfair" style="text-align:center;margin-bottom:20px;">EDIT PROFIL</h3>
    <div class="form-group"><label>Nama Lengkap</label><input type="text" class="form-control" id="editName" value="${currentUser.name}"></div>
    <div class="form-group"><label>No. HP</label><input type="tel" class="form-control" id="editPhone" value="${currentUser.phone || ""}"></div>
    <button class="btn btn-dark" onclick="saveProfile()">SIMPAN PERUBAHAN</button>`;
}

function saveProfile() {
  const name = document.getElementById("editName").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  if (!name) return showToast("Nama tidak boleh kosong!");
  const users = getUsers();
  currentUser.name = name;
  currentUser.phone = phone;
  if (!currentUser.isGuest) {
    users[currentUser.email] = { ...users[currentUser.email], name, phone };
    saveUsers(users);
  }
  updateProfile();
  closeModal();
  showToast("Profil berhasil diperbarui! ✅");
}

function renderAlamat(content) {
  const saved = LS.get("decane_addr_" + currentUser.email) || "";
  content.innerHTML = `
    <button class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <h3 class="playfair" style="text-align:center;margin-bottom:20px;">ALAMAT PENGIRIMAN</h3>
    <div class="form-group"><label>Alamat Utama</label><textarea class="form-control" id="addrInput" rows="4" placeholder="Masukkan alamat lengkap...">${saved}</textarea></div>
    <button class="btn btn-dark" onclick="saveAlamat()">SIMPAN ALAMAT</button>`;
}

function saveAlamat() {
  const addr = document.getElementById("addrInput").value.trim();
  LS.set("decane_addr_" + currentUser.email, addr);
  closeModal();
  showToast("Alamat disimpan! 📍");
}

/* ===== TOAST ===== */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  // Enter di form login
  ["loginEmail", "loginPass"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    });
  });

  // Enter di form register
  ["regName", "regEmail", "regPhone", "regPass"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") doRegister();
    });
  });
});
