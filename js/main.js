const C = window.CONFIG, $ = s => document.querySelector(s);
const go = id => { document.querySelectorAll('.screen').forEach(e => e.classList.toggle('active', e.id === 's-' + id)); $('#s-' + id).scrollTop = 0; };
document.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });

// Cover
$('#names').textContent = `${C.him} ♡ ${C.her}`; $('#title').textContent = C.title; document.title = C.title;
const start = new Date(C.startDate + 'T00:00:00');
$('#days').textContent = Math.max(0, Math.floor((Date.now() - start) / 864e5));

// Musik
const bgm = $('#bgm'), mb = $('#musicBtn'); bgm.src = C.music;
const setMusic = on => { mb.classList.toggle('on', on); on ? bgm.play().catch(() => mb.classList.remove('on')) : bgm.pause(); };
mb.onclick = () => setMusic(bgm.paused);
$('#openBtn').addEventListener('click', () => setMusic(true));

// Tahan untuk isi hati
let p = 0, holding = false; const hb = $('#holdBtn');
hb.addEventListener('pointerdown', e => { e.preventDefault(); holding = true; });
['pointerup', 'pointerleave', 'pointercancel'].forEach(t => hb.addEventListener(t, () => holding = false));
hb.addEventListener('contextmenu', e => e.preventDefault());
setInterval(() => {
  if (p >= 100) return;
  p = Math.max(0, Math.min(100, p + (holding ? 1.2 : -0.8)));
  $('#st1').setAttribute('offset', p / 100); $('#st2').setAttribute('offset', p / 100);
  $('#pct').textContent = Math.round(p);
  const m = C.holdMessages; $('#holdMsg').textContent = p >= 100 ? m[3] : p > 70 ? m[2] : p > 30 ? m[1] : p > 0 ? m[0] : '';
  if (p >= 100) { hb.hidden = true; $('#holdNext').hidden = false; }
}, 30);

// Timeline
$('#tl').innerHTML = C.timeline.map(t => `<li><small>${t.date}</small><b>${t.title}</b><span>${t.text}</span></li>`).join('');

// Galeri + geser hadiah
$('#grid').innerHTML = C.photos.map(f => `<figure><img src="${f.src}" alt="${f.caption}" loading="lazy"><figcaption>${f.caption}</figcaption></figure>`).join('');
document.querySelectorAll('#grid img').forEach(i => i.onerror = () => i.remove());
const th = $('#thumb'), tr = $('#track'); let drag = false, x = 0;
const max = () => tr.clientWidth - th.clientWidth - 8;
th.addEventListener('pointerdown', e => { drag = true; th.setPointerCapture(e.pointerId); });
th.addEventListener('pointermove', e => { if (!drag) return; x = Math.max(0, Math.min(max(), e.clientX - tr.getBoundingClientRect().left - th.clientWidth / 2)); th.style.transform = `translateX(${x}px)`; });
th.addEventListener('pointerup', () => {
  drag = false;
  if (x >= max() * .9) { $('#lock').hidden = true; $('#grid').hidden = false; $('#galNext').hidden = false; }
  else { th.style.transition = 'transform .3s'; th.style.transform = 'translateX(0)'; x = 0; setTimeout(() => th.style.transition = '', 300); }
});

// Kuis
let qi = 0;
function showQ() {
  const q = C.quiz[qi]; $('#qNo').textContent = `Pertanyaan ${qi + 1} dari ${C.quiz.length}`; $('#qText').textContent = q.q; $('#qFb').textContent = '';
  $('#qOpts').innerHTML = ''; q.options.forEach((o, i) => { const b = document.createElement('button'); b.textContent = o;
    b.onclick = () => { if (i === q.answer) { b.className = 'ok'; $('#qFb').textContent = 'Benar!'; setTimeout(() => { ++qi < C.quiz.length ? showQ() : go('letter'); }, 700); }
      else { b.className = 'bad'; $('#qFb').textContent = 'Belum tepat, coba lagi.'; } };
    $('#qOpts').append(b); });
}
showQ();

// Surat
$('#lTitle').textContent = C.letterTitle;
$('#letter').innerHTML = C.letter.map((t, i) => `<p style="animation-delay:${i * 1.2}s">${t}</p>`).join('');
