'use strict';

const PRODUCTION_HOST = 'www.lpossamai.me';
const DEVTO_USERNAME = 'lpossamai';
const DEVTO_API_URL = `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=6`;
const DEVTO_PROFILE_URL = `https://dev.to/${DEVTO_USERNAME}`;
const THEME_COLORS = { light: '#f3efe4', dark: '#0b2545' };

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeSheetTracking();
  initializeReveal();
  initializeDrawing();
  initializeDevToFeed();
  loadAnalytics();
});

/* ===== THEME ===== */
function initializeTheme() {
  const toggle = document.getElementById('theme-toggle');
  const label = toggle?.querySelector('.theme-toggle-text');

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    const name = theme === 'dark' ? 'Blueprint' : 'Paper';
    const next = theme === 'dark' ? 'paper' : 'blueprint';
    if (label) label.textContent = name;
    toggle?.setAttribute('aria-label', `Theme: ${name}. Switch to ${next}.`);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLORS[theme];

    if (persist) {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        // Storage unavailable; the choice lasts for this page view only.
      }
    }
  }

  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  });
}

/* ===== CURRENT SHEET (nav highlight + title block) ===== */
function initializeSheetTracking() {
  const sheets = document.querySelectorAll('section[data-sheet]');
  const links = document.querySelectorAll('[data-sheet-link]');
  const tbSheet = document.getElementById('tb-sheet');
  const readoutSheet = document.getElementById('readout-sheet');
  const readoutName = document.getElementById('readout-name');
  if (sheets.length === 0 || !('IntersectionObserver' in window)) return;

  function setActive(section) {
    const id = section.id;
    links.forEach(link => {
      if (link.dataset.sheetLink === id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
    if (tbSheet) tbSheet.textContent = section.dataset.sheet;
    if (readoutSheet) readoutSheet.textContent = `Sheet ${section.dataset.sheet}`;
    if (readoutName) readoutName.textContent = section.dataset.sheetName;
  }

  // A thin band across the middle of the viewport decides which sheet is "current".
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target);
    });
  }, { rootMargin: '-45% 0px -54% 0px' });

  sheets.forEach(sheet => observer.observe(sheet));
}

/* ===== REVEAL ON SCROLL ===== */
function initializeReveal() {
  const items = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ===== HERO DRAWING ===== */
const PART_DETAILS = {
  edge: ['Detail 1', 'Edge: TLS everywhere, WAF rules, and CDN caching in front of every public entry point.'],
  zone: ['Detail', 'Landing zone: account and subscription vending, segmented networks, and guardrails as code across every environment.'],
  guardrails: ['Detail 2', 'Guardrails: least-privilege IAM, network segmentation, and centralized audit logging built into the foundation.'],
  k8s: ['Detail 3', 'Kubernetes platform: hardened clusters and container runtimes with policy enforced before anything runs.'],
  pipeline: ['Detail 4', 'Ingest and embed: document ingestion and embedding workflows that feed the retrieval layer.'],
  hybrid: ['Detail 4', 'Hybrid retrieval: full-text and vector search side by side, so exact terms and meaning both count.'],
  rerank: ['Detail 4', 'Rank fusion: reciprocal rank fusion plus reranking merges both result sets into one ordered context.'],
  llm: ['Detail 5', 'Model invocation: every LLM call lands in an audit trail, with a human in the loop where it matters.'],
  cicd: ['Detail 6', 'CI/CD: policy checks, security scanning, and cost gates block risky changes before merge.'],
  observe: ['Detail 7', 'Observability: metrics, traces, and logs linked end to end and measured against SLOs.']
};

function initializeDrawing() {
  const figure = document.getElementById('drawing');
  if (!figure) return;

  // Trigger the line-drawing animation once the page has painted, then settle into the static drawing.
  if (prefersReducedMotion) {
    figure.classList.add('is-drawn', 'is-done');
  } else {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => figure.classList.add('is-drawn'));
    });
    window.setTimeout(() => figure.classList.add('is-done'), 1700);
  }

  const refEl = document.getElementById('drawing-detail-ref');
  const textEl = document.getElementById('drawing-detail-text');
  const defaultRef = refEl?.textContent || '';
  const defaultText = textEl?.textContent || '';
  const parts = figure.querySelectorAll('.part');

  function showDetail(part) {
    const detail = PART_DETAILS[part?.dataset.part];
    parts.forEach(p => p.classList.toggle('is-active', p === part));
    figure.classList.toggle('has-active', Boolean(detail));
    if (refEl) refEl.textContent = detail ? detail[0] : defaultRef;
    if (textEl) textEl.textContent = detail ? detail[1] : defaultText;
  }

  parts.forEach(part => {
    part.addEventListener('pointerenter', () => showDetail(part));
    part.addEventListener('focus', () => showDetail(part));
    part.addEventListener('blur', () => showDetail(null));
  });
  figure.querySelector('.plan')?.addEventListener('pointerleave', () => showDetail(null));

  initializeCrosshair(figure);
}

function initializeCrosshair(figure) {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const canvas = figure.querySelector('.drawing-canvas');
  const svg = figure.querySelector('.plan');
  const coords = document.getElementById('drawing-coords');
  if (!canvas || !svg) return;

  const lineX = document.createElement('span');
  const lineY = document.createElement('span');
  lineX.className = 'crosshair crosshair--x';
  lineY.className = 'crosshair crosshair--y';
  lineX.setAttribute('aria-hidden', 'true');
  lineY.setAttribute('aria-hidden', 'true');
  canvas.append(lineX, lineY);

  const viewBox = svg.viewBox.baseVal;
  const pad = n => String(Math.max(0, Math.round(n))).padStart(3, '0');

  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    lineX.style.transform = `translateY(${y}px)`;
    lineY.style.transform = `translateX(${x}px)`;
    canvas.classList.add('is-tracking');

    if (coords) {
      const svgRect = svg.getBoundingClientRect();
      const vx = ((event.clientX - svgRect.left) / svgRect.width) * viewBox.width;
      const vy = ((event.clientY - svgRect.top) / svgRect.height) * viewBox.height;
      coords.textContent = `X ${pad(vx)} Y ${pad(vy)}`;
    }
  });

  canvas.addEventListener('pointerleave', () => canvas.classList.remove('is-tracking'));
}

/* ===== DEV.TO REVISION LOG ===== */
async function initializeDevToFeed() {
  const list = document.getElementById('devto-feed');
  if (!list) return;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(DEVTO_API_URL, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const articles = Array.isArray(data) ? data.slice(0, 6) : [];
    const rows = articles
      .map((article, index) => createRevisionRow(article, articles.length - index, index === 0))
      .filter(Boolean);

    if (rows.length === 0) {
      list.replaceChildren(createStatusRow('No articles yet. Check back soon.'));
    } else {
      list.replaceChildren(...rows);
    }
  } catch (error) {
    console.error('Unable to load articles:', error);
    list.replaceChildren(createStatusRow('Unable to load articles right now. ', {
      href: DEVTO_PROFILE_URL,
      text: 'Read them on dev.to'
    }));
  } finally {
    window.clearTimeout(timeout);
    list.setAttribute('aria-busy', 'false');
  }
}

function createRevisionRow(article, revNumber, isLatest) {
  // Only ever link to dev.to over HTTPS, whatever the API returns.
  const href = safeUrl(article?.url, 'dev.to');
  if (!href) return null;

  const row = el('li', 'rev-row');
  if (isLatest) row.classList.add('rev-row--latest');

  const rev = el('span', 'rev-no');
  rev.append(el('span', 'rev-tri', String(revNumber)));

  // ISO dates, as on a drawing's revision table.
  const published = new Date(article.published_at);
  const date = el('time', 'rev-date');
  if (!Number.isNaN(published.getTime())) {
    date.dateTime = published.toISOString();
    date.textContent = published.toISOString().slice(0, 10);
  }

  const body = el('span', 'rev-body');
  const link = el('a', 'rev-title', sanitizePublicText(article.title || 'Technical article'));
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  body.append(link);

  const description = sanitizePublicText(article.description || '').trim();
  if (description) {
    const excerpt = description.length > 150 ? `${description.slice(0, 150).trimEnd()}…` : description;
    body.append(el('span', 'rev-desc', excerpt));
  }

  const minutes = Number.parseInt(article.reading_time_minutes, 10);
  const read = el('span', 'rev-read', `${Number.isFinite(minutes) && minutes > 0 ? minutes : 1} min`);

  row.append(rev, date, body, read);
  return row;
}

function createStatusRow(message, link) {
  const row = el('li', 'rev-status', message);
  if (link) {
    const anchor = el('a', '', link.text);
    anchor.href = link.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    row.append(anchor);
  }
  return row;
}

function safeUrl(value, allowedHost) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:' && url.hostname === allowedHost ? url.href : null;
  } catch (error) {
    return null;
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function sanitizePublicText(text) {
  const replacements = [
    [/\bAmazon Web Services\b/gi, 'public cloud'],
    [/\bAmazon\b/gi, 'cloud provider'],
    [/\bAWS\b/g, 'cloud platform'],
    [/\bAzure\b/g, 'cloud platform'],
    [/\bMicrosoft\b/gi, 'cloud provider'],
    [/\bCloudFront\b/g, 'edge network'],
    [/\bEC2\b/g, 'virtual machines'],
    [/\bECS\b/g, 'container service'],
    [/\bEKS\b/g, 'managed Kubernetes'],
    [/\bFargate\b/g, 'serverless containers'],
    [/\bS3\b/g, 'object storage'],
    [/\bWAF\b/g, 'web firewall'],
    [/\bGitHub\b/g, 'code platform'],
    [/\bGitLab\b/g, 'CI platform'],
    [/\bOpenAI\b/g, 'model provider'],
    [/\bPinecone\b/g, 'vector database'],
    [/\bCohere\b/g, 'reranking provider']
  ];

  return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), String(text));
}

/* ===== ANALYTICS (production host only) ===== */
function loadAnalytics() {
  if (window.location.hostname !== PRODUCTION_HOST) return;

  const beacon = document.createElement('script');
  beacon.defer = true;
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token: 'd22633aaaade42e08e4779be8e8b48eb' });
  document.head.appendChild(beacon);
}
