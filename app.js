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