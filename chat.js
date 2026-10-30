/* MPS Assistant: a free, offline FAQ chat. Answers come from the site's own content;
   anything it can't answer is handed to WhatsApp, a call or the quote form. */
(function () {
  if (document.querySelector('.mps-chat')) return;

  var WA = 'https://wa.me/27796540862';
  var TEL = 'tel:+27120060001';
  var links = {
    quote: { label: 'Get a quote', href: 'contact.html#quote' },
    wa: { label: 'WhatsApp us', href: WA, ext: true },
    call: { label: 'Call 012 006 0001', href: TEL },
    services: { label: 'View services', href: 'services.html' },
    jobs: { label: 'See open roles', href: 'careers.html#openings' },
    apply: { label: 'Apply now', href: 'careers.html#apply' },
    profile: { label: 'Company profile (PDF)', href: 'downloads/mukondeleli-company-profile-2026.pdf', ext: true },
    gallery: { label: 'Open the gallery', href: 'gallery.html' },
    about: { label: 'About us', href: 'about.html' }
  };

  // Each topic: keywords to match, the answer, and follow-up buttons.
  var topics = [
    { id: 'services', chip: 'Our services',
      keys: ['service', 'offer', 'provide', 'what do you do', 'help with', 'solutions'],
      text: 'We offer six services:<ul><li><b>Guarding &amp; site security</b>: static guards, patrols, access control, multi-storey sites</li><li><b>Event &amp; VIP security</b>: crowd control, car guards, cash escorts, bodyguards</li><li><b>Corporate services</b>: executive protection, office and factory security, countermeasures</li><li><b>Private investigation</b>: surveillance, fraud and theft, missing persons</li><li><b>Technical &amp; CCTV</b>: design, installation and maintenance</li><li><b>I.T security</b>: network security, data recovery, IT forensics</li></ul>',
      actions: ['services', 'quote'] },
    { id: 'quote', chip: 'Get a quote',
      keys: ['quote', 'price', 'cost', 'how much', 'rate', 'pricing', 'fee', 'charge', 'hire', 'book', 'budget'],
      text: 'Every quote is built for your site, so prices depend on the number of officers, hours of cover and the risks involved. We work on <b>competitive flat rates</b>.<br><br>How it works: 1) tell us about your site, 2) we assess your needs with you, 3) you get a tailored quote. The form takes about two minutes.',
      actions: ['quote', 'wa'] },
    { id: 'guarding', keys: ['guard', 'guarding', 'patrol', 'armed', 'unarmed', 'static', 'site security', 'access control', 'estate', 'residential', 'complex'],
      text: 'Yes. We provide <b>armed and unarmed guarding</b> for residential estates, businesses, construction and multi-storey sites, including patrols, access control and monitoring. Each contract gets a named site manager and supervisors.',
      actions: ['quote', 'services'] },
    { id: 'events', keys: ['event', 'vip', 'crowd', 'concert', 'wedding', 'function', 'bodyguard', 'protection officer', 'cpo', 'escort'],
      text: 'We secure events of any size, from community days to corporate functions with 400+ guests. That covers crowd control, access screening, car guards, cash escorts and VIP or bodyguard protection.',
      actions: ['quote', 'gallery'] },
    { id: 'cctv', keys: ['cctv', 'camera', 'alarm', 'surveillance system', 'install', 'technical'],
      text: 'Our technical team designs, installs and commissions <b>CCTV systems</b>, and handles maintenance and service calls.',
      actions: ['quote', 'services'] },
    { id: 'it', keys: ['it security', 'cyber', 'network', 'data recovery', 'forensic', 'lan', 'wan', 'computer', 'hack'],
      text: 'Our I.T security services cover network and internet security, data recovery, IT forensics, telecommunication services and LAN/WAN installations.',
      actions: ['quote', 'services'] },
    { id: 'investigation', keys: ['investigat', 'detective', 'fraud', 'theft', 'missing', 'undercover', 'stealing'],
      text: 'We handle private investigations including surveillance, fraud and theft, undercover operations and locating missing persons. Everything is kept strictly confidential.',
      actions: ['wa', 'quote'] },
    { id: 'jobs', chip: 'Jobs & careers',
      keys: ['job', 'career', 'vacanc', 'hiring', 'work for', 'employ', 'apply', 'position', 'recruit', 'cv', 'opening'],
      text: 'We are hiring! Current roles are <b>Security Officer (Grade C)</b>, <b>Site Supervisor</b> and <b>Event Security Officer</b>.<br><br>You will need PSIRA registration, SAPS clearance, security training certificates and willingness to work shifts. Apply online and attach your CV (PDF or Word, up to 5 MB).',
      actions: ['jobs', 'apply'] },
    { id: 'requirements', keys: ['requirement', 'qualif', 'grade', 'need to join', 'psira certificate', 'training'],
      text: 'To join us you need: PSIRA registration and security training certificates, SAPS security clearance, a suitable education level and physical fitness, the ability to read, write and communicate in English, and willingness to work shifts including nights and weekends.',
      actions: ['apply'] },
    { id: 'location', chip: 'Our offices',
      keys: ['where', 'address', 'office', 'location', 'located', 'branch', 'directions', 'kamhlushwa', 'nkomazi', 'pretoria', 'sunnyside', 'area', 'mpumalanga'],
      text: '<b>Head office</b><br>Office 524–525, Esselen Towers, 202 Robert Sobukwe St, Sunnyside, Pretoria, 0002<br><br><b>Branch office</b><br>No. 1602, Kamhlushwa Shopping Centre, Kamhlushwa-Nkomazi, 1332',
      actions: [{ label: 'Open in Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=Esselen+Towers+202+Robert+Sobukwe+St+Sunnyside+Pretoria', ext: true }, 'quote'] },
    { id: 'contact', chip: 'Contact us',
      keys: ['contact', 'phone', 'call', 'number', 'email', 'whatsapp', 'reach', 'speak', 'talk', 'human', 'person', 'agent'],
      text: 'You can reach a real person here:<br>Office: <a href="' + TEL + '">012 006 0001</a><br>Mobile &amp; WhatsApp: <a href="' + WA + '" target="_blank" rel="noopener">079 654 0862</a><br>Email: <a href="mailto:nthungenih@mukondelelips.co.za">nthungenih@mukondelelips.co.za</a>',
      actions: ['wa', 'call'] },
    { id: 'hours', keys: ['hour', 'open', 'time', '24', 'night', 'weekend', 'emergency', 'urgent', 'response'],
      text: 'Our security operations run <b>24/7</b>, with rapid response ready around the clock. For anything urgent, call or WhatsApp us directly.',
      actions: ['call', 'wa'] },
    { id: 'psira', chip: 'Are you registered?',
      keys: ['psira', 'registered', 'registration', 'legal', 'licen', 'compliant', 'accredit', 'legit', 'trust', 'coida', 'uif', 'company reg'],
      text: 'Yes. We are <b>PSIRA registered (Reg. 4503619)</b> and a registered company (2017/529753/07). We operate under the PSIRA Act, the Firearm Control Act, COIDA, UIF and other legal mandates, and every officer is vetted.',
      actions: ['profile', 'about'] },
    { id: 'about', keys: ['about', 'who are you', 'history', 'founded', 'established', 'owner', 'black owned', 'experience', 'mukondeleli mean', 'meaning'],
      text: 'Mukondeleli Protection Services (Pty) Ltd was established in <b>2017</b>. We are a proudly South African, <b>100% Black-owned</b> company. "Mukondeleli" means <i>one who perseveres, one who is patient</i>, and our motto is <i>Innovating future of security</i>.',
      actions: ['about', 'profile'] },
    { id: 'profile', chip: 'Company profile',
      keys: ['profile', 'brochure', 'pdf', 'document', 'download'],
      text: 'Our 2026 company profile covers who we are, our services, recruitment, screening and operating model in 12 pages.',
      actions: ['profile'] },
    { id: 'social', keys: ['facebook', 'instagram', 'tiktok', 'social', 'twitter', 'linkedin', 'review'],
      text: 'Find us on <a href="https://www.facebook.com/MukondeleliProtectionServices" target="_blank" rel="noopener">Facebook</a>, <a href="https://www.instagram.com/Mukondeleli_Protection_Service/" target="_blank" rel="noopener">Instagram</a>, <a href="https://x.com/MukondeleliProt" target="_blank" rel="noopener">X</a> and <a href="https://www.tiktok.com/@mukondeleli.prote" target="_blank" rel="noopener">TikTok</a>.',
      actions: ['gallery'] },
    { id: 'hi', keys: ['hello', 'hi', 'hey', 'howzit', 'sawubona', 'good morning', 'good afternoon', 'good evening', 'dumela'],
      text: 'Hi there! What can I help you with today?', actions: [] },
    { id: 'thanks', keys: ['thank', 'thanks', 'great', 'ok', 'okay', 'cool', 'bye'],
      text: 'You are welcome! Stay safe, and reach out any time.', actions: ['quote'] }
  ];

  var chips = topics.filter(function (t) { return t.chip; });

  function findTopic(q) {
    q = ' ' + q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ') + ' ';
    var best = null, bestScore = 0;
    topics.forEach(function (t) {
      var score = 0;
      t.keys.forEach(function (k) {
        // Short words must match whole words; longer ones may be word starts ("vacanc" -> vacancies).
        var hit = k.length <= 3 ? q.indexOf(' ' + k + ' ') > -1 : q.indexOf(' ' + k) > -1 || q.indexOf(k) > -1 && k.indexOf(' ') > -1;
        if (hit) score += k.length > 4 ? 2 : 1;
      });
      // Greetings and thanks only win when nothing more specific matched.
      if ((t.id === 'hi' || t.id === 'thanks') && score) score = 0.5;
      if (score > bestScore) { best = t; bestScore = score; }
    });
    return best;
  }

  /* ---------- UI ---------- */
  var root = document.createElement('div');
  root.className = 'mps-chat';
  root.innerHTML =
    '<button class="mps-chat-launch" type="button" aria-expanded="false" aria-controls="mpsChatPanel" aria-label="Chat with the MPS assistant">' +
      '<svg class="i-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5Z"/><path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01"/></svg>' +
      '<svg class="i-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '<span class="mps-chat-nudge">Need help? Ask us</span>' +
    '</button>' +
    '<section class="mps-chat-panel" id="mpsChatPanel" role="dialog" aria-label="MPS assistant" hidden>' +
      '<header class="mps-chat-head">' +
        '<img src="logo-white.png" alt="" class="mps-chat-logo">' +
        '<div><strong>MPS Assistant</strong><span><i></i>Here to help, any time</span></div>' +
        '<button type="button" class="mps-chat-x" aria-label="Close chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '</header>' +
      '<div class="mps-chat-log" aria-live="polite"></div>' +
      '<form class="mps-chat-form" autocomplete="off">' +
        '<input type="text" name="q" placeholder="Type your question…" aria-label="Your question" maxlength="200">' +
        '<button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-6 16-3-7Z"/></svg></button>' +
      '</form>' +
      '<p class="mps-chat-foot">Automated assistant · For emergencies call <a href="' + TEL + '">012 006 0001</a></p>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.mps-chat-launch');
  var panel = root.querySelector('.mps-chat-panel');
  var log = root.querySelector('.mps-chat-log');
  var form = root.querySelector('.mps-chat-form');
  var input = form.querySelector('input');
  var started = false;

  function actionHtml(a) {
    var l = typeof a === 'string' ? links[a] : a;
    return '<a class="mps-chat-action" href="' + l.href + '"' + (l.ext ? ' target="_blank" rel="noopener"' : '') + '>' + l.label + '</a>';
  }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function add(html, who) {
    var m = document.createElement('div');
    m.className = 'mps-msg ' + (who || 'bot');
    m.innerHTML = html;
    log.appendChild(m); scroll();
    return m;
  }
  function chipRow(list) {
    var row = document.createElement('div');
    row.className = 'mps-chat-chips';
    list.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = t.chip;
      b.addEventListener('click', function () { ask(t.chip, t); });
      row.appendChild(b);
    });
    log.appendChild(row); scroll();
  }
  function reply(topic) {
    var typing = add('<span class="mps-typing"><i></i><i></i><i></i></span>', 'bot typing');
    setTimeout(function () {
      typing.remove();
      if (topic) {
        add(topic.text + (topic.actions.length ? '<div class="mps-chat-actions">' + topic.actions.map(actionHtml).join('') + '</div>' : ''));
      } else {
        add('I\'m not sure about that one, but our team can help straight away.<div class="mps-chat-actions">' + actionHtml('wa') + actionHtml('call') + actionHtml('quote') + '</div>');
      }
      chipRow(chips.filter(function (c) { return !topic || c.id !== topic.id; }).slice(0, 4));
    }, 550);
  }
  function ask(text, topic) {
    var old = log.querySelectorAll('.mps-chat-chips');
    for (var i = 0; i < old.length; i++) old[i].remove();
    var u = add('', 'user'); u.textContent = text;
    reply(topic || findTopic(text));
  }
  function open(state) {
    panel.hidden = !state;
    root.classList.toggle('is-open', state);
    launch.setAttribute('aria-expanded', state ? 'true' : 'false');
    if (state) {
      root.classList.add('seen');
      if (!started) {
        started = true;
        add('Hi! 👋 I\'m the Mukondeleli assistant. Ask me about our services, quotes, jobs or where to find us.');
        chipRow(chips);
      }
      setTimeout(function () { input.focus({ preventScroll: true }); }, 50);
    } else {
      launch.focus({ preventScroll: true });
    }
  }

  launch.addEventListener('click', function () { open(panel.hidden); });
  root.querySelector('.mps-chat-x').addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) open(false); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    ask(q);
  });
  // Show the little "Need help?" nudge once, a few seconds after the first page view.
  try {
    if (!sessionStorage.getItem('mpsChatNudge')) {
      setTimeout(function () { if (panel.hidden) root.classList.add('nudge'); }, 6000);
      setTimeout(function () { root.classList.remove('nudge'); }, 14000);
      sessionStorage.setItem('mpsChatNudge', '1');
    }
  } catch (err) { /* storage blocked: skip the nudge */ }
})();
