// Mukondeleli Protection Services — shared site behavior
// Each feature is isolated in its own try/catch so a failure in one
// (e.g. an older browser missing an API) can never block or hide the rest.

// Opening a page from a link starts it at the top. Refresh, back/forward and
// #section links keep the browser's normal behaviour, and once the visitor
// starts scrolling the page is left alone.
try {
  var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  var navType = navEntry ? navEntry.type : (performance.navigation && performance.navigation.type === 0 ? 'navigate' : '');
  if (navType === 'navigate' && !window.location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var userMoved = false;
    var markMoved = function () { userMoved = true; };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
      window.addEventListener(t, markMoved, { passive: true, once: true });
    });
    var toTop = function () { if (!userMoved) window.scrollTo(0, 0); };
    toTop();
    document.addEventListener('DOMContentLoaded', toTop);
    window.addEventListener('load', function () {
      toTop();
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
    });
  }
} catch (err) { /* page-top handling skipped */ }

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile navigation toggle */
  try {
    var toggle = document.querySelector('.menu-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      var navAnchors = links.getElementsByTagName('a');
      for (var i = 0; i < navAnchors.length; i++) {
        navAnchors[i].addEventListener('click', function () {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    }
  } catch (err) { /* mobile nav toggle unavailable; static nav still works */ }

  /* Highlight the current page in the nav */
  try {
    var here = (window.location.pathname.split('/').pop() || 'index.html');
    var navLinkEls = document.querySelectorAll('.nav-links a[href]');
    for (var j = 0; j < navLinkEls.length; j++) {
      var href = navLinkEls[j].getAttribute('href');
      if (href === here || (here === '' && href === 'index.html')) {
        navLinkEls[j].className += ' active';
      }
    }
  } catch (err) { /* active-link highlight skipped */ }

  /* Footer year */
  try {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) { /* footer year skipped */ }

  // Returning up the About page must never replay or finish a moving reveal.
  if (document.body.classList.contains('page-about')) {
    var lastAboutScroll = window.scrollY;
    window.addEventListener('scroll', function () {
      var current = window.scrollY;
      if (current < lastAboutScroll) {
        document.body.classList.add('about-scrolling-up');
        document.querySelectorAll('.reveal').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
        });
      } else if (current > lastAboutScroll) {
        document.body.classList.remove('about-scrolling-up');
      }
      lastAboutScroll = current;
    }, { passive: true });
  }
  /* Single, quiet scroll-reveal pass (progressively enhanced) */
  try {
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) {
            entries[k].target.classList.add('is-visible');
            io.unobserve(entries[k].target);
          }
        }
      }, { threshold: document.body.classList.contains('page-about') ? 0.12 : 0, rootMargin: document.body.classList.contains('page-about') ? '0px 0px -8% 0px' : '0px 0px -15% 0px' });
      for (var m = 0; m < revealEls.length; m++) { io.observe(revealEls[m]); }
    } else {
      for (var n = 0; n < revealEls.length; n++) { revealEls[n].className += ' is-visible'; }
    }
  } catch (err) {
    // If anything above fails, make sure content is never left hidden.
    var fallbackEls = document.querySelectorAll('.reveal');
    for (var p = 0; p < fallbackEls.length; p++) { fallbackEls[p].className += ' is-visible'; }
  }

  /* Pause ambient background videos for users who prefer reduced motion */
  try {
    var reduceMotionVideos = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotionVideos) {
      var bgVideos = document.querySelectorAll('.services-video-bg video, .why-us-video-bg video');
      for (var v = 0; v < bgVideos.length; v++) {
        bgVideos[v].removeAttribute('autoplay');
        bgVideos[v].pause();
      }
    }
  } catch (err) { /* background video pause skipped */ }

  /* Subtle 3D pointer-tilt on the Why Mukondeleli cards (desktop pointers only) */
  try {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var tiltCards = document.querySelectorAll('.values-grid > div');
    if (!reduceMotion && finePointer && tiltCards.length) {
      for (var t = 0; t < tiltCards.length; t++) {
        (function (card) {
          card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var midX = rect.width / 2;
            var midY = rect.height / 2;
            var rotateY = ((e.clientX - rect.left - midX) / midX) * 2;
            var rotateX = -((e.clientY - rect.top - midY) / midY) * 2;
            card.style.transform = 'translateY(-2px) perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
          });
          card.addEventListener('mouseleave', function () {
            card.style.transform = '';
          });
        })(tiltCards[t]);
      }
    }
  } catch (err) { /* 3D tilt unavailable; cards keep their simple CSS hover */ }

  /* Extend the same 3D "camera" feel to the whole Why Mukondeleli section,
     not just the individual cards: a gentle whole-section parallax tilt. */
  try {
    var reduceMotionWide = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointerWide = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var whyUsSection = document.querySelector('.why-us');
    var whyUsInner = whyUsSection ? whyUsSection.querySelector('.container') : null;
    if (!reduceMotionWide && finePointerWide && whyUsSection && whyUsInner) {
      whyUsSection.addEventListener('mousemove', function (e) {
        var rect = whyUsSection.getBoundingClientRect();
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotateY = ((e.clientX - rect.left - midX) / midX) * 1.15;
        var rotateX = -((e.clientY - rect.top - midY) / midY) * 1.15;
        whyUsInner.style.transform = 'perspective(1700px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
      });
      whyUsSection.addEventListener('mouseleave', function () {
        whyUsInner.style.transform = '';
      });
    }
  } catch (err) { /* whole-section tilt unavailable; individual card tilt still works */ }


  try {
    // Quote form — posts to FormSubmit, which emails the enquiry and redirects back here
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      var qStatus = document.getElementById('formMessage');
      if (/[?&]sent=1/.test(window.location.search)) {
        contactForm.innerHTML =
          '<div class="qt-success" role="status">' +
          '<div class="qt-success-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></div>' +
          '<h3>Thank you, we\'ve got your request</h3>' +
          '<p>A member of our team will be in touch to discuss your security needs.</p>' +
          '</div>';
        var quoteSection = document.getElementById('quote');
        if (quoteSection) quoteSection.scrollIntoView();
      } else {
        var qRequired = contactForm.querySelectorAll('input[required]:not([type=radio]), textarea[required]');
        var qCheck = function (el) {
          var bad = !el.checkValidity();
          var f = el.closest('.qt-field');
          if (f) f.classList.toggle('invalid', bad);
          return !bad;
        };
        for (var qi = 0; qi < qRequired.length; qi++) {
          qRequired[qi].addEventListener('blur', function () { qCheck(this); });
          qRequired[qi].addEventListener('input', function () {
            var f = this.closest('.qt-field');
            if (f && f.classList.contains('invalid')) qCheck(this);
          });
        }
        contactForm.addEventListener('submit', function (e) {
          var first = null;
          for (var k = 0; k < qRequired.length; k++) {
            if (!qCheck(qRequired[k]) && !first) first = qRequired[k];
          }
          if (first) {
            e.preventDefault();
            qStatus.className = 'qt-status error';
            qStatus.textContent = 'Please check the highlighted fields.';
            first.focus();
            return;
          }
          var next = contactForm.querySelector('input[name="_next"]');
          if (next && /^https?:$/.test(window.location.protocol)) {
            next.value = window.location.origin + window.location.pathname + '?sent=1#quote';
          }
          var btn = contactForm.querySelector('button[type="submit"]');
          btn.disabled = true;
          btn.querySelector('.qt-submit-label').textContent = 'Sending...';
          qStatus.className = 'qt-status';
          qStatus.textContent = 'Sending your request, please wait.';
        });
        window.addEventListener('pageshow', function () {
          var btn = contactForm.querySelector('button[type="submit"]');
          if (!btn) return;
          btn.disabled = false;
          btn.querySelector('.qt-submit-label').textContent = 'Request my quote';
          qStatus.textContent = '';
        });
      }
    }
  } catch (err) { /* contact form handler skipped */ }

  /* Careers application form — posts (with the CV attached) to FormSubmit,
     which emails it to the recruitment inbox and redirects back here. */
  try {
    var careersForm = document.getElementById('careersForm');
    if (careersForm) {
      var CV_MAX_BYTES = 5 * 1024 * 1024;
      var CV_TYPES = /\.(pdf|docx?)$/i;
      var cvInput = document.getElementById('cf-cv');
      var cvDrop = careersForm.querySelector('.careers-drop');
      var cvName = careersForm.querySelector('.careers-drop-file');
      var positionSelect = document.getElementById('cf-position');
      var statusEl = document.getElementById('careersFormMessage');

      // Returning from a successful submission
      if (/[?&]applied=1/.test(window.location.search)) {
        careersForm.innerHTML =
          '<div class="careers-success" role="status">' +
          '<div class="careers-success-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg></div>' +
          '<h3>Application received</h3>' +
          '<p>Thank you for applying. Our recruitment team will be in touch if your profile matches an opening.</p>' +
          '</div>';
        var applySection = document.getElementById('apply');
        if (applySection) applySection.scrollIntoView();
      } else {
        // "Apply for this role" links preselect the position
        var applyLinks = document.querySelectorAll('[data-position]');
        for (var a = 0; a < applyLinks.length; a++) {
          applyLinks[a].addEventListener('click', function () {
            if (positionSelect) positionSelect.value = this.getAttribute('data-position');
          });
        }

        var fieldOf = function (el) { return el.closest('.careers-field'); };

        var cvError = function () {
          var file = cvInput.files && cvInput.files[0];
          if (!file) return true;
          return !CV_TYPES.test(file.name) || file.size > CV_MAX_BYTES;
        };

        var checkField = function (el) {
          var bad = el === cvInput ? cvError() : !el.checkValidity();
          var field = fieldOf(el);
          if (field) field.classList.toggle('invalid', bad);
          return !bad;
        };

        var showCvName = function () {
          var file = cvInput.files && cvInput.files[0];
          if (cvName) cvName.textContent = file ? file.name + ' (' + Math.max(1, Math.round(file.size / 1024)) + ' KB)' : '';
          if (cvDrop) cvDrop.classList.toggle('has-file', !!file && !cvError());
          if (file) checkField(cvInput);
        };

        if (cvInput && cvDrop) {
          cvInput.addEventListener('change', showCvName);
          ['dragenter', 'dragover'].forEach(function (t) {
            cvDrop.addEventListener(t, function () { cvDrop.classList.add('dragging'); });
          });
          ['dragleave', 'drop'].forEach(function (t) {
            cvDrop.addEventListener(t, function () { cvDrop.classList.remove('dragging'); });
          });
        }

        var requiredEls = careersForm.querySelectorAll('[required]');
        for (var r = 0; r < requiredEls.length; r++) {
          (function (el) {
            var evt = el.type === 'checkbox' || el.type === 'file' ? 'change' : 'blur';
            el.addEventListener(evt, function () { checkField(el); });
            el.addEventListener('input', function () {
              if (fieldOf(el) && fieldOf(el).classList.contains('invalid')) checkField(el);
            });
          })(requiredEls[r]);
        }

        careersForm.addEventListener('submit', function (e) {
          var firstBad = null;
          for (var i = 0; i < requiredEls.length; i++) {
            if (!checkField(requiredEls[i]) && !firstBad) firstBad = requiredEls[i];
          }
          if (firstBad) {
            e.preventDefault();
            statusEl.className = 'careers-form-status error';
            statusEl.textContent = 'Please check the highlighted fields.';
            firstBad.focus();
            return;
          }
          // FormSubmit needs an absolute URL to send applicants back to
          var next = careersForm.querySelector('input[name="_next"]');
          if (next && /^https?:$/.test(window.location.protocol)) {
            next.value = window.location.origin + window.location.pathname + '?applied=1#apply';
          }
          var btn = careersForm.querySelector('button[type="submit"]');
          btn.classList.add('loading');
          btn.disabled = true;
          btn.querySelector('.careers-submit-label').textContent = 'Sending...';
          statusEl.className = 'careers-form-status';
          statusEl.textContent = 'Uploading your application, please wait.';
        });

        // Coming back with the browser's Back button must not leave the button stuck
        window.addEventListener('pageshow', function () {
          var btn = careersForm.querySelector('button[type="submit"]');
          if (!btn) return;
          btn.classList.remove('loading');
          btn.disabled = false;
          btn.querySelector('.careers-submit-label').textContent = 'Submit application';
          statusEl.textContent = '';
        });
      }
    }
  } catch (err) { /* careers form handler skipped */ }

  /* Footer newsletter subscribe (no backend configured yet) */
  try {
    var subscribeForm = document.getElementById('footerSubscribeForm');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('footerSubscribeMessage');
        if (msg) {
          msg.textContent = 'Thanks — you\'re on the list.';
        }
        subscribeForm.reset();
      });
    }
  } catch (err) { /* footer subscribe handler skipped */ }

  /* Contact map: load Google Maps on the live site, or when asked */
  try {
    var mapWrap = document.getElementById('officeMap');
    if (mapWrap) {
      var mapFrame = mapWrap.querySelector('iframe[data-src]');
      var loadMap = function () {
        mapFrame.src = mapFrame.getAttribute('data-src');
        mapWrap.classList.add('map-loaded');
      };
      // Previews and local files block embedded Google Maps, so keep the location card there
      var isPreview = /claude/i.test(window.location.hostname);
      if (!isPreview) loadMap();
    }
  } catch (err) { /* map loader skipped; directions link still works */ }

  /* Back-to-top button */
  try {
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  } catch (err) { /* back-to-top skipped */ }

});

/* Belt-and-braces: if DOMContentLoaded never fires as expected in some
   environment, still reveal content after load rather than leave it hidden. */
window.addEventListener('load', function () {
  try {
    // Other pages keep the safety reveal. About uses the observer so its
    // sections reveal once as they enter the viewport.
    if (!document.body.classList.contains('page-about')) {
      var els = document.querySelectorAll('.reveal:not(.is-visible)');
      if (els.length) {
        setTimeout(function () {
          for (var i = 0; i < els.length; i++) { els[i].classList.add('is-visible'); }
        }, 1200);
      }
    }
  } catch (err) { /* no-op */ }
  /* Subtle site-wide cursor-reactive ambient colour. */
  try {
    var fineCursor = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var reduceCursor = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fineCursor && !reduceCursor) {
      var cursorFrame = 0;
      var cursorX = window.innerWidth / 2;
      var cursorY = window.innerHeight / 2;
      document.addEventListener('mousemove', function (e) {
        cursorX = e.clientX; cursorY = e.clientY;
        document.body.style.setProperty('--cursor-active', '1');
        if (!cursorFrame) cursorFrame = requestAnimationFrame(function () {
          document.body.style.setProperty('--cursor-x', cursorX + 'px');
          document.body.style.setProperty('--cursor-y', cursorY + 'px');
          cursorFrame = 0;
        });
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () {
        document.body.style.setProperty('--cursor-active', '0');
      });
    }
  } catch (err) { /* ambient cursor effect skipped */ }

  /* Footer nebula: gentle cursor parallax/wobble. */
  try {
    var footer = document.querySelector('footer');
    var nebula = footer && footer.querySelector('.footer-nebula');
    var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (footer && nebula && finePointer && !reducedMotion) {
      var nebulaFrame = 0;
      footer.addEventListener('mousemove', function (e) {
        var r = footer.getBoundingClientRect();
        var nx = ((e.clientX - r.left) / r.width - .5);
        var ny = ((e.clientY - r.top) / r.height - .5);
        if (!nebulaFrame) nebulaFrame = requestAnimationFrame(function () {
          nebula.style.setProperty('--nebula-x', (nx * 110).toFixed(1) + 'px');
          nebula.style.setProperty('--nebula-y', (ny * 78).toFixed(1) + 'px');
          nebula.style.setProperty('--nebula-rx', (-ny * 9.5).toFixed(2) + 'deg');
          nebula.style.setProperty('--nebula-ry', (nx * 12).toFixed(2) + 'deg');
          nebulaFrame = 0;
        });
      }, { passive: true });
      footer.addEventListener('mouseleave', function () {
        nebula.style.setProperty('--nebula-x','0px'); nebula.style.setProperty('--nebula-y','0px');
        nebula.style.setProperty('--nebula-rx','0deg'); nebula.style.setProperty('--nebula-ry','0deg');
      });
    }
  } catch (err) { /* footer nebula remains animated without cursor parallax */ }

});

// Cookie consent: initialise after the full page DOM exists.
function initCookieConsent() {
  const banner = document.getElementById('cookieConsent');
  if (!banner) return;
  const key = 'mps-cookie-consent';
  let choice = null;
  try { choice = localStorage.getItem(key); } catch (_) {}

  if (!choice) {
    // Small delay ensures the entrance animation is visible on desktop and mobile.
    window.setTimeout(() => {
      banner.classList.add('is-visible');
      banner.setAttribute('aria-hidden', 'false');
    }, 350);
  }

  banner.querySelectorAll('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-cookie-choice');
      try { localStorage.setItem(key, value); } catch (_) {}
      banner.classList.remove('is-visible');
      banner.setAttribute('aria-hidden', 'true');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent, { once: true });
} else {
  initCookieConsent();
}

/* About page: full-section nebula cursor wobble + scroll motion. */
(function(){
  function initAboutMotion(){
    var page=document.querySelector('.page-about');
    var zone=document.querySelector('.about-continuous');
    var nebula=zone&&zone.querySelector('.about-nebula');
    if(!page||!zone||!nebula)return;
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced)return;
    var fine=window.matchMedia&&window.matchMedia('(pointer: fine)').matches;
    var raf=0,nx=0,ny=0;
    if(fine){
      zone.addEventListener('mousemove',function(e){
        var r=zone.getBoundingClientRect();
        nx=((e.clientX-r.left)/r.width-.5); ny=((e.clientY-r.top)/Math.max(r.height,1)-.5);
        if(!raf)raf=requestAnimationFrame(function(){
          nebula.style.setProperty('--about-x',(nx*150).toFixed(1)+'px');
          nebula.style.setProperty('--about-y',(ny*105).toFixed(1)+'px');
          nebula.style.setProperty('--about-rx',(-ny*11).toFixed(2)+'deg');
          nebula.style.setProperty('--about-ry',(nx*15).toFixed(2)+'deg'); raf=0;
        });
      },{passive:true});
      zone.addEventListener('mouseleave',function(){['--about-x','--about-y'].forEach(function(v){nebula.style.setProperty(v,'0px')});nebula.style.setProperty('--about-rx','0deg');nebula.style.setProperty('--about-ry','0deg')});
    }
    // Background stays fixed while scrolling.
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAboutMotion);else initAboutMotion();
})();

/* About page Velaris: WebGL simplex-noise field adapted to the existing static site. */
(function(){
  function initVelaris(){
    var canvas=document.getElementById('aboutVelarisCanvas')||document.querySelector('.footer-velaris');
    var zone=canvas&&canvas.closest('.about-continuous, footer');
    if(!canvas||!zone)return;
    var gl=canvas.getContext('webgl',{alpha:false,antialias:false});
    if(!gl)return;
    var vs='attribute vec2 position;varying vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
    var fs='precision highp float;varying vec2 vUv;uniform vec2 u_resolution;uniform float u_time;uniform float u_grain;uniform vec3 u_colors[4];uniform vec3 u_bg;vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}void main(){vec2 uv=vUv;float ratio=u_resolution.x/u_resolution.y;vec2 p=uv-.5;p.x*=ratio;float t=u_time*.1;float n1=snoise(p*.4+vec2(t*.2,-t*.3));float n2=snoise(p*.55+vec2(-t*.15,t*.25)+n1*.25);float n3=snoise(p*.75+vec2(t*.1,-t*.2)+n2*.2);vec3 col=u_bg;float dist=length(p)*1.5;float vignette=1.-smoothstep(.3,1.2,dist);col=mix(col,u_colors[0],smoothstep(-.2,.5,n1)*.85);col=mix(col,u_colors[1],smoothstep(-.1,.6,n2)*.7);col=mix(col,u_colors[2],smoothstep(-.3,.4,n3)*.6);col=mix(col,u_colors[3],smoothstep(0.,.7,n1*n2)*.5);float glow=smoothstep(.8,0.,dist)*.3;col+=u_colors[1]*glow;col=mix(col*.2,col,vignette);float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453+u_time);col+=(grain-.5)*u_grain*.1;gl_FragColor=vec4(col,1.);}';
    function shader(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
    var program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);
    var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);var pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    var res=gl.getUniformLocation(program,'u_resolution'),time=gl.getUniformLocation(program,'u_time'),grain=gl.getUniformLocation(program,'u_grain'),cols=gl.getUniformLocation(program,'u_colors'),bg=gl.getUniformLocation(program,'u_bg');
    /* MPS palette: deep navy, electric blue, steel blue, restrained warm gold. */
    var palette=new Float32Array([.035,.16,.38, .055,.31,.61, .12,.42,.72, .82,.58,.12]);
    gl.uniform3fv(cols,palette);gl.uniform3f(bg,.008,.025,.085);gl.uniform1f(grain,.22);
    function resize(){var d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(innerWidth*1.12*d));canvas.height=Math.max(1,Math.floor(innerHeight*1.16*d));gl.viewport(0,0,canvas.width,canvas.height)}
    resize();addEventListener('resize',resize,{passive:true});
    var reduced=matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,start=performance.now(),raf;
    function draw(now){gl.uniform2f(res,canvas.width,canvas.height);gl.uniform1f(time,reduced?0:(now-start)*.001*1.45);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(draw)}raf=requestAnimationFrame(draw);
    if(!reduced&&matchMedia('(pointer:fine)').matches){var pf=0,x=0,y=0;document.addEventListener('mousemove',function(e){x=e.clientX/innerWidth-.5;y=e.clientY/innerHeight-.5;if(!pf)pf=requestAnimationFrame(function(){zone.style.setProperty('--velaris-x',(x*72).toFixed(1)+'px');zone.style.setProperty('--velaris-y',(y*54).toFixed(1)+'px');zone.style.setProperty('--velaris-rot',(x*1.8).toFixed(2)+'deg');pf=0})},{passive:true});}
    // No scroll-driven background translation.
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initVelaris,{once:true});else initVelaris();
})();
