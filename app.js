firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function getPseudo() {
  return localStorage.getItem('pseudo');
}
function setPseudo(p) {
  localStorage.setItem('pseudo', p);
}
function requirePseudo() {
  const p = getPseudo();
  if (!p) window.location.href = 'index.html';
  return p;
}
function getVisitor() { return localStorage.getItem('visitor') === '1'; }
function setVisitor() { localStorage.removeItem('pseudo'); localStorage.setItem('visitor', '1'); }
function clearSession() { localStorage.removeItem('pseudo'); localStorage.removeItem('visitor'); }
function requireSession() {
  const p = getPseudo();
  const v = getVisitor();
  if (!p && !v) window.location.href = 'index.html';
  return { pseudo: p, visitor: v };
}

// Calcule le budget engagé = somme des items où pseudo est actuellement meilleur enchérisseur
function computeBudgetEngage(items, pseudo) {
  let total = 0;
  Object.values(items || {}).forEach(it => {
    if (it.currentBidder === pseudo && it.status !== 'cancelled') total += it.currentBid;
  });
  return total;
}

function fmtTime(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function openLightbox(src) {
  let overlay = document.getElementById('lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.className = 'lightbox-overlay';
    overlay.onclick = () => overlay.classList.remove('show');
    const img = document.createElement('img');
    img.id = 'lightbox-img';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }
  document.getElementById('lightbox-img').src = src;
  overlay.classList.add('show');
}

function getSoundOn() { return localStorage.getItem('soundOn') !== '0'; }
function setSoundOn(on) {
  localStorage.setItem('soundOn', on ? '1' : '0');
  document.querySelectorAll('.sound-btn').forEach(b => b.textContent = on ? '🔊' : '🔇');
}
function toggleSound() { setSoundOn(!getSoundOn()); }
function initSoundBtn() { document.querySelectorAll('.sound-btn').forEach(b => b.textContent = getSoundOn() ? '🔊' : '🔇'); }

function playTone(freq, duration = 150, type = 'sine') {
  if (!getSoundOn()) return;
  try {
    const ctx = window._audioCtx || (window._audioCtx = new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {}
}
function playDing() { playTone(1300, 130, 'sine'); }
function playGong() { playTone(160, 1000, 'sine'); }
function vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

function resizeImageToBase64(file, maxSize = 500, quality = 0.55) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) { height *= maxSize / width; width = maxSize; }
        else if (height > maxSize) { width *= maxSize / height; height = maxSize; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}