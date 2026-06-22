document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Console easter egg
  --------------------------------------------------------- */
  console.log('%cconnection established.', 'color:#56E1E9; font-family:monospace; font-size:14px;');
  console.log('%cnice instinct, opening devtools on a security student\'s site.\nsay hi: https://github.com/SurojitNaskar', 'color:#8694A8; font-family:monospace; font-size:12px;');

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Active section highlight in nav
  --------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     Scroll-reveal animations
  --------------------------------------------------------- */
  function animateCount(el, target, decimals, suffix, duration) {
    if (!el) return;
    if (prefersReducedMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }

    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  function triggerEduLogFill() {
    var hsFill = document.getElementById('hsBarFill');
    var sscFill = document.getElementById('sscBarFill');
    var hsPct = document.getElementById('hsPctText');
    var sscPct = document.getElementById('sscPctText');

    if (hsFill) requestAnimationFrame(function () { hsFill.style.width = hsFill.dataset.pct + '%'; });
    if (sscFill) requestAnimationFrame(function () { sscFill.style.width = sscFill.dataset.pct + '%'; });
    if (hsFill && hsPct) animateCount(hsPct, parseFloat(hsFill.dataset.pct), 1, '%', 1100);
    if (sscFill && sscPct) animateCount(sscPct, parseFloat(sscFill.dataset.pct), 2, '%', 1100);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      triggerEduLogFill();
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.id === 'eduLog') triggerEduLogFill();
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---------------------------------------------------------
     Scroll progress bar
  --------------------------------------------------------- */
  var progressFill = document.getElementById('scrollProgressFill');
  var backTop = document.getElementById('backTop');
  var ticking = false;

  function updateScrollUI() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressFill) progressFill.style.width = pct + '%';

    if (backTop) {
      var show = scrollTop > 480;
      backTop.classList.toggle('is-visible', show);
      backTop.setAttribute('tabindex', show ? '0' : '-1');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  });
  updateScrollUI();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Boot / handshake intro sequence
  --------------------------------------------------------- */
  var boot = document.getElementById('boot');
  var heroContent = document.getElementById('heroContent');

  function revealHero() {
    if (heroContent) heroContent.classList.add('is-visible');
    startRoleTypewriter();
  }

  if (prefersReducedMotion || !boot) {
    revealHero();
  } else {
    var bootLines = boot.querySelectorAll('p');
    var bi = 0;
    boot.classList.add('is-typing');

    function showNextBootLine() {
      if (bi >= bootLines.length) {
        setTimeout(revealHero, 250);
        return;
      }
      bootLines[bi].style.opacity = '1';
      bi++;
      setTimeout(showNextBootLine, 420);
    }

    bootLines.forEach(function (l) { l.style.opacity = '0'; l.style.transition = 'opacity 0.25s ease'; });
    setTimeout(showNextBootLine, 300);
  }

  /* ---------------------------------------------------------
     Hero role typewriter
  --------------------------------------------------------- */
  var roleEl = document.getElementById('roleText');
  var roles = [
    'B.Sc (Hons) Advanced Networking & Cybersecurity',
    '2nd Year · Semester 3 · Brainware University',
    'Learning network defense & ethical hacking',
    'Exploring Full-Stack Dev, AI & ML'
  ];

  function startRoleTypewriter() {
    if (!roleEl) return;
    if (prefersReducedMotion) { roleEl.textContent = roles[0]; return; }

    var ri = 0, ci = 0, deleting = false;

    function tick() {
      var current = roles[ri];
      if (!deleting) {
        ci++;
        roleEl.textContent = current.slice(0, ci);
        if (ci >= current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 38);
      } else {
        ci--;
        roleEl.textContent = current.slice(0, ci);
        if (ci <= 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 18);
      }
    }
    tick();
  }

  /* ---------------------------------------------------------
     Skills network graph (SVG, generated at runtime, interactive)
  --------------------------------------------------------- */
  var svg = document.getElementById('skillGraph');
  var skillInfo = document.getElementById('skillInfo');

  var skillDescriptions = {
    'Python': 'Scripting, automation, and the language I reach for first.',
    'C': 'Low-level fundamentals — memory, pointers, how the machine actually works.',
    'C++': 'Performance-minded programming built on core C concepts.',
    'Java': 'Object-oriented development for coursework and projects.',
    'MySQL': 'Relational databases — schema design and queries.',
    'Linux': 'Daily driver for system administration and security tooling.',
    'Cybersecurity': 'Core focus of my degree — network defense, ethical hacking, IT infrastructure.',
    'Networking': 'The other half of ANCS — protocols and how systems talk to each other.',
    'AI / ML': 'Currently exploring, alongside the security coursework.',
    'Full-Stack Web': 'Building this very site, and leveling up along the way.'
  };

  if (svg) {
    var skills = Object.keys(skillDescriptions);
    var cx = 320, cy = 320, radius = 200;
    var ns = 'http://www.w3.org/2000/svg';

    function makeEl(tag, attrs) {
      var el = document.createElementNS(ns, tag);
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      return el;
    }

    var edgesGroup = makeEl('g', { class: 'edges' });
    var nodesGroup = makeEl('g', { class: 'nodes' });
    svg.appendChild(edgesGroup);
    svg.appendChild(nodesGroup);

    // Center node
    var centerNode = makeEl('g', { class: 'node-link center' });
    centerNode.appendChild(makeEl('circle', { class: 'node-circle', cx: cx, cy: cy, r: 34 }));
    var centerText = makeEl('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', 'font-size': '13' });
    centerText.textContent = 'SN';
    centerNode.appendChild(centerText);
    nodesGroup.appendChild(centerNode);

    var allNodeGroups = [];
    var allEdges = [];

    function selectSkill(label, nodeGroup, edge) {
      allNodeGroups.forEach(function (n) { n.classList.remove('is-active'); });
      allEdges.forEach(function (e) { e.classList.remove('is-active'); });
      if (nodeGroup) nodeGroup.classList.add('is-active');
      if (edge) edge.classList.add('is-active');
      if (skillInfo) {
        skillInfo.innerHTML = '<strong>' + label + '</strong> — ' + skillDescriptions[label];
      }
    }

    function spawnRipple(nx, ny) {
      if (prefersReducedMotion) return;
      var ripple = makeEl('circle', { class: 'node-ripple', cx: nx, cy: ny, r: 22 });
      nodesGroup.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    }

    skills.forEach(function (label, idx) {
      var angle = (Math.PI * 2 * idx) / skills.length - Math.PI / 2;
      var nx = cx + radius * Math.cos(angle);
      var ny = cy + radius * Math.sin(angle);

      // Edge
      var edge = makeEl('line', {
        class: 'graph-edge',
        x1: cx, y1: cy, x2: nx, y2: ny
      });
      edgesGroup.appendChild(edge);
      allEdges.push(edge);

      // Pulse dot travelling along the edge (skipped if reduced motion)
      if (!prefersReducedMotion) {
        var pulse = makeEl('circle', { class: 'graph-pulse', r: 3 });
        var anim = makeEl('animateMotion', {
          dur: (3 + (idx % 4) * 0.6).toFixed(1) + 's',
          repeatCount: 'indefinite',
          path: 'M' + cx + ',' + cy + ' L' + nx + ',' + ny,
          begin: (idx * 0.25) + 's'
        });
        pulse.appendChild(anim);
        edgesGroup.appendChild(pulse);
      }

      // Node (focusable, clickable)
      var node = makeEl('g', {
        class: 'node-link',
        tabindex: '0',
        role: 'button',
        'aria-label': 'View skill: ' + label
      });
      node.appendChild(makeEl('circle', { class: 'node-circle', cx: nx, cy: ny, r: 22 }));
      nodesGroup.appendChild(node);
      allNodeGroups.push(node);

      node.addEventListener('click', function () { selectSkill(label, node, edge); spawnRipple(nx, ny); });
      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectSkill(label, node, edge);
          spawnRipple(nx, ny);
        }
      });

      // Label, placed slightly outside the node along the same radial direction
      var labelDist = radius + 38;
      var lx = cx + labelDist * Math.cos(angle);
      var ly = cy + labelDist * Math.sin(angle);
      var labelText = makeEl('text', {
        x: lx, y: ly,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '12.5'
      });
      labelText.textContent = label;
      nodesGroup.appendChild(labelText);
    });
  }

  /* ---------------------------------------------------------
     Copy-to-clipboard for contact rows
  --------------------------------------------------------- */
  document.querySelectorAll('.connect-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'copied';
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('is-copied');
        }, 1500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () { fallbackCopy(value, done); });
      } else {
        fallbackCopy(value, done);
      }
    });
  });

  function fallbackCopy(value, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      /* clipboard unavailable — fail silently */
    }
  }

  /* ---------------------------------------------------------
     Cursor glow + trail (desktop, fine-pointer only)
  --------------------------------------------------------- */
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var cursorDot = document.getElementById('cursorDot');

  if (cursorDot && !prefersReducedMotion && !isCoarsePointer) {
    var lastTrailTime = 0;

    document.addEventListener('mousemove', function (e) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorDot.classList.add('is-active');

      var now = Date.now();
      if (now - lastTrailTime > 45) {
        lastTrailTime = now;
        var particle = document.createElement('span');
        particle.className = 'trail-particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        document.body.appendChild(particle);
        particle.addEventListener('animationend', function () { particle.remove(); });
      }
    });

    document.addEventListener('mouseleave', function () {
      cursorDot.classList.remove('is-active');
    });
  }

  /* ---------------------------------------------------------
     Hero mouse parallax (desktop, fine-pointer only)
  --------------------------------------------------------- */
  var hero = document.getElementById('home');

  if (hero && !prefersReducedMotion && !isCoarsePointer) {
    var heroGridEl = hero.querySelector('.hero-grid');
    var heroTopEl = hero.querySelector('.hero-top');
    var profileFrameEl = hero.querySelector('.profile-frame');
    var heroRelX = 0, heroRelY = 0, heroTicking = false;

    function applyHeroParallax() {
      if (heroGridEl) heroGridEl.style.transform = 'translate(' + (heroRelX * -16).toFixed(1) + 'px, ' + (heroRelY * -16).toFixed(1) + 'px)';
      if (heroTopEl) heroTopEl.style.transform = 'translate(' + (heroRelX * 6).toFixed(1) + 'px, ' + (heroRelY * 6).toFixed(1) + 'px)';
      if (profileFrameEl) profileFrameEl.style.transform = 'translate(' + (heroRelX * 14).toFixed(1) + 'px, ' + (heroRelY * 14).toFixed(1) + 'px)';
      heroTicking = false;
    }

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      heroRelX = (e.clientX - rect.left) / rect.width - 0.5;
      heroRelY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!heroTicking) { requestAnimationFrame(applyHeroParallax); heroTicking = true; }
    });

    hero.addEventListener('mouseleave', function () {
      heroRelX = 0; heroRelY = 0;
      if (heroGridEl) heroGridEl.style.transform = '';
      if (heroTopEl) heroTopEl.style.transform = '';
      if (profileFrameEl) profileFrameEl.style.transform = '';
    });
  }

});