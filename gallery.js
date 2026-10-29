// Gallery page — client feedback wall, photo filters and full-screen viewer
document.addEventListener('DOMContentLoaded', function () {
  /* Client feedback wall (data lives in reviews.js) */
  try {
    var wall = document.getElementById('reviewWall');
    var reviews = window.MPS_REVIEWS || [];
    // Placeholder reviews never appear on the live site
    if (/mukondeleli/i.test(window.location.hostname)) {
      reviews = reviews.filter(function (r) { return !r.sample && !r.example; });
    }
    if (wall && !reviews.length) {
      var section = document.getElementById('feedback');
      if (section) section.hidden = true;
    }
    if (wall && reviews.length) {
      var ICONS = {
        facebook: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.4 19.5v-6h2l.3-2.4h-2.3V9.6c0-.7.2-1.2 1.2-1.2h1.2V6.3c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8h-2v2.4h2v6h2.4Z"/></svg>',
        google: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path fill="#4285F4" d="M19.6 12.2c0-.6-.1-1.1-.2-1.6H12v3h4.3a3.7 3.7 0 0 1-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.8Z"/><path fill="#34A853" d="M12 20c2.2 0 4-.7 5.3-1.9l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.9-1.4-4.5-3.3H4.8v2.1A8 8 0 0 0 12 20Z"/><path fill="#FBBC05" d="M7.5 13.6a4.8 4.8 0 0 1 0-3.1V8.4H4.8a8 8 0 0 0 0 7.3l2.7-2.1Z"/><path fill="#EA4335" d="M12 7.2c1.2 0 2.2.4 3.1 1.2l2.3-2.3A8 8 0 0 0 4.8 8.4l2.7 2.1C8.1 8.6 9.9 7.2 12 7.2Z"/></svg>',
        instagram: '<svg viewBox="0 0 24 24"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".35" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect width="24" height="24" rx="7" fill="url(#igg)"/><rect x="6" y="6" width="12" height="12" rx="3.6" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="15.6" cy="8.4" r=".9" fill="#fff"/></svg>',
        tiktok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#111"/><path fill="#fff" d="M15.6 6.5c.5 1.2 1.4 2 2.7 2.1v2.2a5 5 0 0 1-2.7-.8v4.2a4 4 0 1 1-4-4v2.2a1.8 1.8 0 1 0 1.8 1.8V5.6h2.2v.9Z"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0A66C2"/><path fill="#fff" d="M7.2 9.6h2.3V17H7.2V9.6Zm1.1-3.7a1.3 1.3 0 1 1 0 2.7 1.3 1.3 0 0 1 0-2.7ZM10.9 9.6h2.2v1c.3-.6 1.1-1.2 2.3-1.2 2.4 0 2.8 1.6 2.8 3.6V17h-2.3v-3.6c0-.9 0-2-1.2-2s-1.4.9-1.4 1.9V17h-2.3V9.6Z"/></svg>'
      };
      var NAMES = { facebook: 'Facebook', google: 'Google', instagram: 'Instagram', tiktok: 'TikTok', linkedin: 'LinkedIn' };
      var esc = function (t) {
        return String(t == null ? '' : t).replace(/[&<>"']/g, function (ch) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
      };
      var initials = function (n) {
        return esc(String(n).split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase());
      };
      var stars = function (r) {
        var out = '';
        for (var i = 1; i <= 5; i++) out += '<span class="' + (i <= r ? 'on' : '') + '">★</span>';
        return '<div class="gx-stars" role="img" aria-label="' + r + ' out of 5 stars">' + out + '</div>';
      };

      wall.innerHTML = reviews.map(function (r) {
        var avatar = r.photo
          ? '<img alt="" src="' + esc(r.photo) + '"/>'
          : '<span>' + initials(r.name) + '</span>';
        var top = r.rating ? stars(r.rating) : '<div class="gx-quote-mark" aria-hidden="true">“</div>';
        var platform = ICONS[r.platform] ? '<span class="gx-platform" title="' + NAMES[r.platform] + '">' + ICONS[r.platform] + '</span>' : '';
        var meta = [r.role, r.date].filter(Boolean).map(esc).join(' · ');
        var link = r.link ? '<a class="gx-review-link" href="' + esc(r.link) + '" rel="noopener noreferrer" target="_blank">View on ' + (NAMES[r.platform] || 'site') + '</a>' : '';
        return '<article class="gx-review reveal">' +
          '<div class="gx-avatar">' + avatar + '</div>' +
          '<div class="gx-review-top">' + top + platform + '</div>' +
          '<p class="gx-review-text">' + esc(r.text) + '</p>' +
          '<div class="gx-review-by"><strong>' + esc(r.name) + '</strong>' + (meta ? '<span>' + meta + '</span>' : '') + link + '</div>' +
          '</article>';
      }).join('');

      // Summary only counts real (non-example) star ratings
      var rated = reviews.filter(function (r) { return r.rating && !r.example; });
      var summary = document.getElementById('feedbackSummary');
      if (summary && rated.length) {
        var avg = rated.reduce(function (t, r) { return t + r.rating; }, 0) / rated.length;
        summary.innerHTML = '<strong>' + avg.toFixed(1) + '</strong>' + stars(Math.round(avg)) +
          '<span>from ' + rated.length + ' review' + (rated.length === 1 ? '' : 's') + ' shown</span>';
        summary.hidden = false;
      }

      // Cards are added after the shared reveal observer ran, so show them directly
      var cards = wall.querySelectorAll('.gx-review');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
        }, { threshold: 0.15 });
        for (var q = 0; q < cards.length; q++) io.observe(cards[q]);
      } else {
        for (var q2 = 0; q2 < cards.length; q2++) cards[q2].classList.add('is-visible');
      }
    }
  } catch (err) { /* feedback wall unavailable */ }

  try {
    var items = Array.prototype.slice.call(document.querySelectorAll('.pg-item'));
    var chips = document.querySelectorAll('.pg-chip');
    var box = document.getElementById('pgLightbox');
    if (!items.length || !box) return;

    /* Filters */
    for (var c = 0; c < chips.length; c++) {
      chips[c].addEventListener('click', function () {
        var f = this.getAttribute('data-filter');
        for (var k = 0; k < chips.length; k++) chips[k].setAttribute('aria-pressed', chips[k] === this ? 'true' : 'false');
        items.forEach(function (it) {
          it.hidden = f !== 'all' && it.getAttribute('data-cat') !== f;
          if (!it.hidden) it.classList.add('is-visible');
        });
      });
    }

    /* Viewer */
    var img = box.querySelector('.pg-stage img');
    var cap = box.querySelector('.pg-stage strong');
    var count = box.querySelector('.pg-count');
    var current = 0, opener = null;
    var visible = function () { return items.filter(function (it) { return !it.hidden; }); };

    var show = function (i) {
      var list = visible();
      current = (i + list.length) % list.length;
      var btn = list[current].querySelector('.pg-open');
      img.src = btn.getAttribute('data-full');
      img.alt = btn.querySelector('img').alt;
      cap.textContent = img.alt;
      count.textContent = (current + 1) + ' / ' + list.length;
    };
    var open = function (it) {
      opener = it.querySelector('.pg-open');
      box.hidden = false;
      document.body.classList.add('pg-locked');
      show(visible().indexOf(it));
      box.querySelector('.pg-close').focus();
    };
    var close = function () {
      box.hidden = true;
      img.src = '';
      document.body.classList.remove('pg-locked');
      if (opener) opener.focus();
    };

    items.forEach(function (it) {
      it.querySelector('.pg-open').addEventListener('click', function () { open(it); });
    });
    box.querySelector('.pg-close').addEventListener('click', close);
    box.querySelector('.pg-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.pg-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'Tab') {
        // keep focus inside the viewer
        var f = box.querySelectorAll('button');
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });

    /* Swipe on touch screens */
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  } catch (err) { /* gallery viewer unavailable; thumbnails still display */ }
});
