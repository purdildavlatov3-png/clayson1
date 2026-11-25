/* ===== SNAKE MARKET — script.js (Vanilla JS) ===== */

/* SVG-логотип: змея в круге (stroke-only, масштабируется) */
const SNAKE = (cls = '') => `<svg class="${cls}" viewBox="0 0 64 64" fill="none" stroke="#7FFF00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle class="ring" cx="32" cy="32" r="29"/>
<path class="draw" d="M40 17c-9-5-19 0-17 8s17 6 18 15-10 12-18 6"/>
<path class="draw" d="M40 17l5-1-3 4" stroke-width="2.5"/>
<circle cx="41.5" cy="17.5" r="1" fill="#7FFF00" stroke="none"/></svg>`;

/* ===== ТОВАРЫ =====
   ЗАМЕНИ: img → реальные ссылки на фото (первое — главное, остальные — галерея).
   Сейчас стоят плейсхолдеры placehold.co */
const ph = t => `https://placehold.co/600x750/141414/7FFF00?text=${encodeURIComponent(t)}`;
const P = [
  {id:1,name:'Diesel Biker Jacket',brand:'Diesel',cat:'Куртки',price:18900,size:'L',year:'2003',desc:'Кожаная байкерская куртка из архивной коллекции. Потёртости и фактура — оригинальные.'},
  {id:2,name:'Number Nine Denim',brand:'Number (N)ine',cat:'Джинсы',price:24500,size:'M',year:'2005',desc:'Кастомные джинсы с рваными вставками. Редкая линия Такахиро Мияситы.'},
  {id:3,name:'Diesel Graphic Tee',brand:'Diesel',cat:'Футболки',price:4900,size:'XL',year:'2001',desc:'Футболка с винтажным принтом, плотный хлопок, лёгкий выцвет.'},
  {id:4,name:'Snake Chain',brand:'Archive',cat:'Аксессуары',price:3200,size:'—',year:'2000-е',desc:'Массивная цепь из стали. Не темнеет, не вызывает аллергии.'},
  {id:5,name:'Number Nine Hoodie',brand:'Number (N)ine',cat:'Футболки',price:15900,size:'M',year:'2006',desc:'Худи с вышивкой и асимметричным капюшоном.'},
  {id:6,name:'Diesel Cargo Pants',brand:'Diesel',cat:'Джинсы',price:8700,size:'32',year:'2004',desc:'Карго с объёмными карманами и контрастной строчкой.'},
  {id:7,name:'Archive Trench',brand:'Diesel',cat:'Куртки',price:21000,size:'M',year:'2002',desc:'Удлинённый плащ из плотного нейлона, скрытая молния.'},
  {id:8,name:'Leather Belt',brand:'Archive',cat:'Аксессуары',price:2900,size:'95',year:'2000-е',desc:'Кожаный ремень с тяжёлой пряжкой.'}
].map(p => ({...p, imgs:[ph(p.name),ph(p.name+' 2'),ph(p.name+' 3')]}));

/* ===== УТИЛИТЫ ===== */
const $ = (s, r = document) => r.querySelector(s);
const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
const go = u => { document.body.classList.add('leave'); setTimeout(() => location.href = u, 280); };
const page = location.pathname.split('/').pop() || 'index.html';

/* ===== КОРЗИНА (localStorage) ===== */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('sm_cart')) || []; } catch (e) {}
const save = () => { try { localStorage.setItem('sm_cart', JSON.stringify(cart)); } catch (e) {} renderCart(); };
function add(id) {
  const it = cart.find(c => c.id === id);
  it ? it.qty++ : cart.push({id, qty:1});
  save();
  const b = $('.cart-btn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function change(id, d) {
  const it = cart.find(c => c.id === id);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) cart = cart.filter(c => c.id !== id);
  save();
}
function renderCart() {
  const rows = cart.map(c => ({...P.find(p => p.id === c.id), qty:c.qty}));
  $('#count').textContent = cart.reduce((s, c) => s + c.qty, 0);
  $('#total').textContent = fmt(rows.reduce((s, r) => s + r.price * r.qty, 0));
  $('#items').innerHTML = rows.length ? rows.map(r => `<div class="ci"><img src="${r.imgs[0]}" alt="">
    <div><h4>${r.name}</h4><span class="price">${fmt(r.price)}</span>
    <div class="qty"><button data-d="-1" data-id="${r.id}">−</button>${r.qty}<button data-d="1" data-id="${r.id}">+</button></div></div>
    <button class="rm" data-d="-99" data-id="${r.id}">Удалить</button></div>`).join('')
    : '<p class="empty">Корзина пуста. Выбери что-нибудь из каталога.</p>';
}

/* ===== ОБЩИЙ ЛЕЙАУТ (шапка, корзина, футер, прелоадер) ===== */
function layout() {
  const nav = (h, t) => `<a href="${h}" class="${page === h ? 'on' : ''}">${t}</a>`;
  document.body.insertAdjacentHTML('afterbegin', SNAKE_DEFS + `
  <div id="preloader">${SNAKE()}</div>
  <header><div class="wrap">
    <a href="index.html" class="logo">${SNAKE()}SNAKE MARKET</a>
    <nav>${nav('index.html','Главная')}${nav('catalog.html','Каталог')}</nav>
    <div class="hdr-r">
      <button class="auth-btn" id="authBtn" aria-label="Войти"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span>Войти</span></button>
      <button class="cart-btn" aria-label="Открыть корзину">Корзина<b id="count">0</b></button>
    </div>
  </div></header>
  <div id="ov"></div>
  <aside id="cart" aria-label="Корзина"><header><h3>Корзина</h3><button id="close" aria-label="Закрыть">×</button></header>
    <div id="items"></div>
    <div class="total"><div><span>Итого</span><span id="total">0 ₽</span></div><button class="btn" id="checkout">Оформить</button></div>
  </aside>
  <div id="authOv" data-view="login"><div class="modal" role="dialog" aria-modal="true" aria-label="Авторизация">
    <svg class="snake" aria-hidden="true"><rect class="trail" pathLength="100" width="100%" height="100%" rx="20"/><rect class="sbody" pathLength="100" width="100%" height="100%" rx="20"/><rect class="shead" pathLength="100" width="100%" height="100%" rx="20"/></svg>
    <button class="m-close" aria-label="Закрыть">×</button>
    <div class="logo m-logo">${SNAKE()}</div>
    <div class="tabs"><button type="button" data-t="login" class="on">Вход</button><button type="button" data-t="reg">Регистрация</button></div>
    <form id="authForm" novalidate>
      <label>Email<input name="email" type="email" autocomplete="email" placeholder="you@mail.com"><small class="err" data-for="email"></small></label>
      <label>Пароль<input name="pw" type="password" autocomplete="current-password" placeholder="Минимум 6 символов"><small class="err" data-for="pw"></small></label>
      <label class="only-reg">Повторите пароль<input name="pw2" type="password" autocomplete="new-password" placeholder="Ещё раз"><small class="err" data-for="pw2"></small></label>
      <button class="btn" type="submit">Войти</button>
    </form>
    <div class="acc"><h3>Личный кабинет</h3><p id="accMail"></p><button class="btn ghost" id="logout" type="button">Выйти</button></div>
  </div></div>`);
  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap">
    <a href="index.html" class="logo">${SNAKE()}SNAKE MARKET</a>
    <div class="soc">
      <!-- ВСТАВЬ ссылку на Telegram -->
      <a href="https://t.me/YOUR_CHANNEL" target="_blank" rel="noopener" aria-label="Telegram" title="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg></a>
      <!-- ВСТАВЬ ссылку на Авито -->
      <a href="https://www.avito.ru/YOUR_PROFILE" target="_blank" rel="noopener" aria-label="Авито" title="Авито"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="8.2" cy="8.2" r="4.6"/><circle cx="17.6" cy="6.4" r="2.6"/><circle cx="6.4" cy="17.6" r="2.6"/><circle cx="16.6" cy="16.6" r="4"/></svg></a>
    </div>
  </div></footer>`);

  const open = v => document.body.classList.toggle('cart-open', v);
  $('.cart-btn').onclick = () => open(true);
  $('#close').onclick = $('#ov').onclick = () => open(false);
  $('#items').onclick = e => { const b = e.target.closest('button'); if (b) change(+b.dataset.id, +b.dataset.d); };
  $('#checkout').onclick = () => cart.length ? alert('Заглушка: оформление заказа. Сумма ' + $('#total').textContent) : alert('Корзина пуста');
  document.addEventListener('keydown', e => e.key === 'Escape' && open(false));
  renderCart();
  initAuth();

  /* Плавный переход между страницами (без белой вспышки) */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href$=".html"],a[href*=".html?"]');
    if (!a || a.target || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); go(a.href);
  });
  window.addEventListener('pageshow', () => document.body.classList.remove('leave'));

  /* Прелоадер: рисуем змею, показываем 1 раз за сессию */
  const pl = $('#preloader');
  if (sessionStorage.getItem('sm_seen')) pl.remove();
  else setTimeout(() => { pl.classList.add('done'); sessionStorage.setItem('sm_seen', 1); setTimeout(() => pl.remove(), 700); }, 1700);
}

/* ===== КАРТОЧКИ + stagger-появление при скролле ===== */
/* Змея, обвивающая карточку. Два SVG-слоя: back (под карточкой) и front (над ней).
   Тело в обоих слоях общее; в front видны только «передние» участки (clipPath #snC) + голова.
   Градиент, чешуя и clipPath задаются один раз в SNAKE_DEFS (вставляется в <body>). */
const SNAKE_D = 'M90 131C80 136 70 126 60 131S40 136 30 131S14 128 7 121S-5 112 1 102S5 90 0 80S-5 68 0 58S5 46 0 36S-5 24 0 14S4 3 14 1S24 -4 36 1S48 5 60 1S72 -4 84 1S90 3 93 1.6';
const SNAKE_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<path id="snP" d="${SNAKE_D}" pathLength="100"/>
<linearGradient id="snG" gradientUnits="userSpaceOnUse" x1="0" y1="130" x2="0" y2="0"><stop offset="0" stop-color="#0b3a00"/><stop offset=".55" stop-color="#3fa800"/><stop offset="1" stop-color="#7FFF00"/></linearGradient>
<pattern id="snS" width="1.8" height="1.8" patternUnits="userSpaceOnUse"><path d="M0 .9a.9.9 0 0 0 1.8 0M-.9 0a.9.9 0 0 0 1.8 0M.9 0a.9.9 0 0 0 1.8 0" fill="none" stroke="#031a00" stroke-width=".22" stroke-opacity=".85"/></pattern>
<clipPath id="snC"><rect x="-12" y="-12" width="124" height="37"/><rect x="-12" y="69" width="30" height="43"/><rect x="45" y="112" width="67" height="30"/></clipPath>
</defs></svg>`;
const SN_BODY = '<use href="#snP" class="sd"/><use href="#snP" class="sb"/><use href="#snP" class="sp"/><use href="#snP" class="sl" transform="translate(-.3 -.3)"/><use href="#snP" class="pulse"/>';
const SN_HEAD = '<g class="sh"><ellipse class="hd" cx="96.3" cy="1.6" rx="4.2" ry="2.5"/><ellipse class="hl" cx="95.8" cy=".7" rx="2.4" ry=".8"/><circle class="eye" cx="97.4" cy=".9" r=".6"/><path class="tg" d="M100.4 1.9l4 0m-4 0l3-1.4m-3 1.4l3 1.4"/></g>';
const SNAKE_BACK = `<svg class="sn back" viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true">${SN_BODY}</svg>`;
const SNAKE_FRONT = `<svg class="sn front" viewBox="0 0 100 130" preserveAspectRatio="none" aria-hidden="true"><g clip-path="url(#snC)">${SN_BODY}</g>${SN_HEAD}</svg>`;

const card = p => `<div class="cw">${SNAKE_BACK}
  <a class="card" href="product.html?id=${p.id}">
  <div class="im"><img src="${p.imgs[0]}" alt="${p.name}" loading="lazy"></div>
  <div class="in-b"><small>${p.brand} · ${p.cat}</small><h3>${p.name}</h3>
  <div class="row"><span class="price">${fmt(p.price)}</span><button class="add" data-id="${p.id}" aria-label="В корзину">+</button></div></div></a>
  ${SNAKE_FRONT}</div>`;

function renderGrid(el, list) {
  el.innerHTML = list.map(card).join('');
  reveal(el);
}
function reveal(root) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), {threshold:.12});
  root.querySelectorAll('.cw').forEach((c, i) => { c.style.setProperty('--i', i % 4); io.observe(c); });
}
document.addEventListener('click', e => {
  const b = e.target.closest('.add,.btn[data-id]');
  if (b) { e.preventDefault(); add(+b.dataset.id); }
});

/* ===== СТРАНИЦЫ ===== */
function initHome() {
  renderGrid($('#featured'), P.slice(0, 4));
  $('.coil').innerHTML = SNAKE();

  /* 3D-параллакс героя: мышь + гироскоп/касание на мобилках */
  const hero = $('.hero');
  const tilt = (x, y) => { hero.style.setProperty('--mx', x.toFixed(3)); hero.style.setProperty('--my', y.toFixed(3)); };
  hero.addEventListener('mousemove', e => tilt(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
  hero.addEventListener('mouseleave', () => tilt(0, 0));
  hero.addEventListener('touchmove', e => { const t = e.touches[0]; tilt(t.clientX / innerWidth * 2 - 1, t.clientY / innerHeight * 2 - 1); }, {passive:true});
}

function initCatalog() {
  const grid = $('#grid'), bar = $('.filters');
  const cats = ['Все', ...new Set(P.map(p => p.cat))];
  bar.innerHTML = cats.map((c, i) => `<button class="${i ? '' : 'on'}">${c}</button>`).join('');
  renderGrid(grid, P);
  bar.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    bar.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    renderGrid(grid, b.textContent === 'Все' ? P : P.filter(p => p.cat === b.textContent));
  };
}

function initProduct() {
  const p = P.find(x => x.id === +new URLSearchParams(location.search).get('id')) || P[0];
  document.title = p.name + ' — SNAKE MARKET';
  $('#pd').innerHTML = `
  <div class="gal"><div class="main"><img id="mainimg" src="${p.imgs[0]}" alt="${p.name}"></div>
    <div class="thumbs">${p.imgs.map((s, i) => `<img src="${s}" class="${i ? '' : 'on'}" alt="Фото ${i + 1}">`).join('')}</div></div>
  <div><small style="color:var(--mut)">${p.brand} · ${p.cat}</small><h1>${p.name}</h1><span class="price">${fmt(p.price)}</span>
    <p>${p.desc}</p>
    <ul><li><span>Размер</span><span>${p.size}</span></li><li><span>Год</span><span>${p.year}</span></li><li><span>Состояние</span><span>Оригинал, проверено</span></li></ul>
    <button class="btn" data-id="${p.id}">В корзину</button></div>`;
  $('.thumbs').onclick = e => {
    if (e.target.tagName !== 'IMG') return;
    $('#mainimg').src = e.target.src;
    document.querySelectorAll('.thumbs img').forEach(i => i.classList.toggle('on', i === e.target));
  };
  renderGrid($('#related'), P.filter(x => x.cat === p.cat && x.id !== p.id).concat(P.filter(x => x.cat !== p.cat)).slice(0, 4));
}

/* ===== АВТОРИЗАЦИЯ (имитация, без бэкенда) =====
   Пользователи: localStorage 'sm_users' {email: hash}; сессия: 'sm_auth' {email}.
   ВАЖНО: это демо. При подключении бэкенда замени submit-обработчик на fetch('/api/login' | '/api/register'). */
const store = {
  get:(k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
  set:(k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del:k => { try { localStorage.removeItem(k); } catch (e) {} }
};
const hash = s => { let h = 5381; for (const c of s) h = (h * 33) ^ c.charCodeAt(0); return (h >>> 0).toString(36); }; // демо-хэш, НЕ для продакшена

function initAuth() {
  const ov = $('#authOv'), form = $('#authForm'), btn = $('#authBtn'), submit = $('.btn', form);
  const user = () => store.get('sm_auth', null);
  let mode = 'login';

  const paint = () => { // кнопка в шапке: «Войти» ↔ «Личный кабинет»
    const u = user(), t = u ? 'Личный кабинет' : 'Войти';
    btn.classList.toggle('on', !!u); btn.setAttribute('aria-label', t); $('span', btn).textContent = t;
  };
  const errors = (e = {}) => {
    form.querySelectorAll('.err').forEach(el => { el.textContent = e[el.dataset.for] || ''; });
    form.querySelectorAll('input').forEach(i => i.classList.toggle('bad', !!e[i.name]));
    if (Object.keys(e).length) { const m = $('.modal'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
  };
  const view = m => {
    mode = m; ov.dataset.view = m; errors();
    ov.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === m));
    submit.textContent = m === 'reg' ? 'Создать аккаунт' : 'Войти';
    form.pw.autocomplete = m === 'reg' ? 'new-password' : 'current-password';
  };
  const open = () => {
    const u = user(); view(u ? 'account' : 'login');
    if (u) $('#accMail').textContent = u.email;
    ov.classList.add('open'); document.body.classList.add('modal-open');
    setTimeout(() => !u && form.email.focus(), 80);
  };
  const close = () => { ov.classList.remove('open'); document.body.classList.remove('modal-open'); };

  btn.onclick = () => user() ? go('profile.html') : open();
  ov.onclick = e => { if (e.target === ov || e.target.closest('.m-close')) close(); };
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
  $('.tabs', ov).onclick = e => { const b = e.target.closest('button'); if (b) view(b.dataset.t); };
  $('#logout').onclick = () => { store.del('sm_auth'); paint(); close(); };
  form.addEventListener('input', e => e.target.classList.remove('bad'));

  form.onsubmit = e => {
    e.preventDefault();
    const em = form.email.value.trim().toLowerCase(), pw = form.pw.value, pw2 = form.pw2.value, err = {};
    const users = store.get('sm_users', {});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) err.email = 'Введите корректный email';
    if (pw.length < 6) err.pw = 'Минимум 6 символов';
    if (mode === 'reg' && !err.pw && pw !== pw2) err.pw2 = 'Пароли не совпадают';
    if (!err.email && !err.pw && !err.pw2) {
      if (mode === 'reg' && users[em]) err.email = 'Этот email уже зарегистрирован';
      if (mode === 'login') { if (!users[em]) err.email = 'Аккаунт не найден — зарегистрируйтесь'; else if (users[em] !== hash(pw)) err.pw = 'Неверный пароль'; }
    }
    errors(err);
    if (Object.keys(err).length) return;
    submit.disabled = true; submit.textContent = '...';          // имитация запроса к серверу
    setTimeout(() => {
      if (mode === 'reg') { users[em] = hash(pw); store.set('sm_users', users); }
      store.set('sm_auth', {email:em});
      submit.disabled = false; form.reset(); paint(); close();
    }, 600);
  };
  paint();
  /* Редирект с profile.html без авторизации: index.html?auth=1 → открыть окно входа */
  if (new URLSearchParams(location.search).get('auth') === '1' && !user()) {
    history.replaceState(null, '', location.pathname);
    setTimeout(open, sessionStorage.getItem('sm_seen') ? 0 : 1900); // после прелоадера
  }
}

/* ===== ЛИЧНЫЙ КАБИНЕТ ===== */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function initProfile() {
  const f = $('#profForm'), tabs = $('.p-tabs'), names = () => store.get('sm_names', {});
  const draw = () => {
    const a = store.get('sm_auth', {}), n = names()[a.email] || '';
    $('#pName').textContent = n || a.email.split('@')[0];
    $('#pMail').textContent = a.email;
    $('#avL').textContent = (n || a.email)[0].toUpperCase();
    f.username.value = n; f.email.value = a.email;
  };
  const show = (e = {}) => {
    f.querySelectorAll('.err').forEach(el => { el.textContent = e[el.dataset.for] || ''; });
    f.querySelectorAll('input').forEach(i => i.classList.toggle('bad', !!e[i.name]));
    if (Object.keys(e).length) { const p = $('.prof'); p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); }
  };
  tabs.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    tabs.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.pane').forEach(p => p.classList.toggle('on', p.id === 'pane-' + b.dataset.t));
  };
  f.addEventListener('input', e => e.target.classList.remove('bad'));
  $('#pLogout').onclick = () => { store.del('sm_auth'); go('index.html'); };

  f.onsubmit = e => {
    e.preventDefault();
    const a = store.get('sm_auth'), users = store.get('sm_users', {}), nm = names(), err = {};
    const un = f.username.value.trim(), em = f.email.value.trim().toLowerCase(), np = f.npw.value;
    if (un && (un.length < 2 || un.length > 24)) err.username = 'От 2 до 24 символов';
    if (!EMAIL_RE.test(em)) err.email = 'Введите корректный email';
    else if (em !== a.email && users[em]) err.email = 'Этот email уже занят';
    if (np && np.length < 6) err.npw = 'Минимум 6 символов';
    else if (np && np !== f.npw2.value) err.npw2 = 'Пароли не совпадают';
    if (!Object.keys(err).length && (em !== a.email || np) && users[a.email] !== hash(f.cpw.value)) err.cpw = 'Введите верный текущий пароль';
    show(err);
    if (Object.keys(err).length) return;

    if (em !== a.email) { // перенос данных на новый email
      users[em] = users[a.email]; delete users[a.email];
      if (nm[a.email] !== undefined) { nm[em] = nm[a.email]; delete nm[a.email]; }
    }
    if (np) users[em] = hash(np);
    un ? nm[em] = un : delete nm[em];
    store.set('sm_users', users); store.set('sm_names', nm); store.set('sm_auth', {email:em});
    f.cpw.value = f.npw.value = f.npw2.value = '';
    draw();
    const ok = $('#ok'); ok.classList.add('show'); setTimeout(() => ok.classList.remove('show'), 2500);
  };
  draw();
}

/* ===== СТАРТ ===== */
/* profile.html без авторизации → на главную с открытым окном входа */
if (page === 'profile.html' && !store.get('sm_auth', null)) location.replace('index.html?auth=1');
else {
  layout();
  ({'index.html':initHome, 'catalog.html':initCatalog, 'product.html':initProduct, 'profile.html':initProfile}[page] || initHome)();
}
