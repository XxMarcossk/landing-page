// Personalize aqui a data em que vocês começaram a namorar (fuso horário de Brasília).
const RELATIONSHIP_START = new Date('2026-08-13T00:00:00-03:00');
const pad = n => String(n).padStart(2, '0');
function updateCountdown() {
  const elapsed = Math.max(0, Math.floor((Date.now() - RELATIONSHIP_START.getTime()) / 1000));
  document.getElementById('days').textContent = Math.floor(elapsed / 86400);
  document.getElementById('hours').textContent = pad(Math.floor(elapsed % 86400 / 3600));
  document.getElementById('minutes').textContent = pad(Math.floor(elapsed % 3600 / 60));
  document.getElementById('seconds').textContent = pad(elapsed % 60);
}
updateCountdown(); setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const menu = document.getElementById('menuToggle'), nav = document.getElementById('navigation');
menu.addEventListener('click', () => { let open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '×' : '☰' });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = '☰' }));

// Pequenas pétalas decorativas (sem imagens externas).
const petalBox = document.getElementById('petals');
function addPetals(count = 20) { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; for (let i = 0; i < count; i++) { const p = document.createElement('span'); p.className = 'petal'; p.textContent = ['♥', '✿', '♡'][i % 3]; p.style.left = Math.random() * 100 + '%'; p.style.fontSize = (10 + Math.random() * 18) + 'px'; p.style.opacity = .45 + Math.random() * .4; p.style.setProperty('--drift', (Math.random() * 260 - 130) + 'px'); p.style.animationDuration = (6 + Math.random() * 6) + 's'; p.style.animationDelay = (Math.random() * 5) + 's'; petalBox.appendChild(p); p.addEventListener('animationend', () => p.remove()) } }
addPetals(15);
function shower() { addPetals(60) }

let lastFocus = null;
function openModal(modal) { lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; modal.querySelector('.modal-paper,.photo-modal-content').focus() }
function closeModal(modal) { modal.hidden = true; document.body.style.overflow = ''; lastFocus?.focus() }
document.getElementById('openLetter').addEventListener('click', () => openModal(document.getElementById('letterModal')));
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el.closest('.modal'))));
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal:not([hidden])').forEach(closeModal) });
const photoModal = document.getElementById('photoModal'), largePhoto = document.getElementById('largePhoto');
document.querySelectorAll('.polaroid').forEach(btn => btn.addEventListener('click', () => {
  const image = btn.querySelector('img'); if (image.style.display === 'none' || !image.complete || image.naturalWidth === 0) return;
  largePhoto.src = image.src; largePhoto.alt = image.alt; document.getElementById('largeCaption').textContent = btn.dataset.caption; openModal(photoModal);
}));

const audio = document.getElementById('ourSong');
const spotifyPlay = document.getElementById('spotifyPlay');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const introScreen = document.getElementById('introScreen'), enterMemorial = document.getElementById('enterMemorial');
function formatTime(time) { if (!isFinite(time)) return '0:00'; const m = Math.floor(time / 60); const s = Math.floor(time % 60); return `${m}:${String(s).padStart(2, '0')}`; }
function updateMusicButton() {
  const playing = !audio.paused;
  if (spotifyPlay) {
    spotifyPlay.textContent = playing ? '❚❚' : '▶';
    spotifyPlay.setAttribute('aria-label', playing ? 'Pausar nossa música' : 'Tocar nossa música');
  }
}
function musicProblem() { console.warn('Áudio indisponível: verifique assets/nossa-musica.mp3'); }
enterMemorial.addEventListener('click', () => {
  // O play é iniciado DIRETAMENTE pelo clique, permitido em navegadores móveis.
  const playPromise = audio.play();
  introScreen.classList.add('intro-leaving');
  document.body.classList.remove('intro-open');
  setTimeout(() => { introScreen.hidden = true; introScreen.remove(); }, 650);
  if (playPromise) playPromise.catch(musicProblem);
});
if (spotifyPlay) {
  spotifyPlay.addEventListener('click', () => {
    if (audio.paused) { const p = audio.play(); if (p) p.catch(musicProblem); }
    else audio.pause();
  });
}
audio.addEventListener('play', updateMusicButton);
audio.addEventListener('pause', updateMusicButton);
audio.addEventListener('error', musicProblem);
audio.addEventListener('loadedmetadata', () => { durationTimeEl.textContent = formatTime(audio.duration); });
audio.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressBar.style.width = progress + '%';
});
const surpriseBtn = document.getElementById('surpriseBtn');
surpriseBtn.addEventListener('click', () => { document.getElementById('surpriseMessage').classList.add('show'); surpriseBtn.style.display = 'none'; shower() });
