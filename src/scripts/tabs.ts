// Navbar behaviour (Header.astro, TabPanel.astro; decisions in NOTES.md).
//
//   - over-the-hero state: the header is transparent while the hero is under
//     it and solid afterwards (data-over-hero); on phones the top row folds
//     away past the hero (CSS, keyed on data-has-hero + data-over-hero)
//   - desktop scrollspy: the section link whose panel is under the bar gets
//     aria-current
//   - phone tabs (< md): a tab shows its panel, hides the others, scrolls the
//     page so the panel starts right under the bar, and writes the fragment
//     with replaceState; a same-page anchor (#inquire from any CTA) whose
//     target lives in a hidden panel opens that panel first, then the normal
//     jump happens; arriving with a fragment opens the right panel; arrow
//     keys move between tabs
//
// After a panel switch a `hitides:tabchange` event lets motion.ts refresh
// ScrollTrigger. ClientRouter lifecycle: bind on astro:page-load, release on
// astro:before-swap (one AbortController). Pages without panels (/gallery)
// still get the header state.
import { defaultTab } from '../data/tabs';

const MOBILE = window.matchMedia('(max-width: 47.99rem)'); // below Tailwind md
const COLLAPSED_BAR_PX = 44; // phone tab row height once the top row folds

interface Elements {
  header: HTMLElement;
  hero: HTMLElement | null;
  anchor: HTMLElement | null;
  tabs: HTMLAnchorElement[]; // phone tab row
  links: HTMLAnchorElement[]; // desktop section links
  panels: HTMLElement[];
}

let els: Elements | null = null;
let controller: AbortController | null = null;
let ticking = false;

function collect(): Elements | null {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return null;
  return {
    header,
    hero: document.querySelector<HTMLElement>('[data-hero]'),
    anchor: document.querySelector<HTMLElement>('[data-tabs-anchor]'),
    tabs: Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-tablist] [data-tab]')),
    links: Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-navlinks] [data-tab]')),
    panels: Array.from(document.querySelectorAll<HTMLElement>('[data-tab-panel]')),
  };
}

function panelOf(target: Element | null): HTMLElement | null {
  if (!target) return null;
  if (target.matches('[data-tab-panel]')) return target as HTMLElement;
  return target.closest<HTMLElement>('[data-tab-panel]');
}

// --- header state + scrollspy ---------------------------------------------

function updateHeader(): void {
  if (!els) return;
  const { header, hero, links, panels } = els;
  const barH = header.offsetHeight;
  const overHero = hero ? window.scrollY < hero.offsetHeight - barH : false;
  header.toggleAttribute('data-over-hero', overHero);

  if (MOBILE.matches || !panels.length) return;
  // Desktop scrollspy: the last panel whose top has passed the bar.
  let currentId: string | null = null;
  for (const p of panels) {
    if (p.getBoundingClientRect().top <= barH + 24) currentId = p.dataset.tabPanel ?? null;
  }
  for (const link of links) {
    if (link.dataset.tab === currentId) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}

function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateHeader();
  });
}

// --- phone tabs -------------------------------------------------------------

function setActive(id: string, opts: { entered?: boolean } = {}): boolean {
  if (!els) return false;
  const panel = els.panels.find((p) => p.dataset.tabPanel === id);
  if (!panel) return false;
  const changed = !panel.hasAttribute('data-active');

  for (const p of els.panels) {
    const on = p === panel;
    p.toggleAttribute('data-active', on);
    p.toggleAttribute('data-entered', on && !!opts.entered);
  }
  for (const tab of els.tabs) {
    const on = tab.dataset.tab === id;
    tab.setAttribute('aria-selected', on ? 'true' : 'false');
    tab.tabIndex = on ? 0 : -1;
    if (on) {
      const list = tab.parentElement;
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({
          left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
          behavior: 'smooth',
        });
      }
    }
  }
  if (changed) {
    document.dispatchEvent(new CustomEvent('hitides:tabchange', { detail: { id } }));
  }
  return true;
}

function scrollToPanels(): void {
  if (!els?.anchor) return;
  const top = els.anchor.getBoundingClientRect().top + window.scrollY - COLLAPSED_BAR_PX;
  window.scrollTo({ top, behavior: 'auto' });
}

function applyHash(scroll: boolean): void {
  if (!els || !MOBILE.matches || !els.panels.length) return;
  const hash = decodeURIComponent(location.hash.slice(1));
  if (!hash) return;
  const target = document.getElementById(hash);
  const panel = panelOf(target);
  if (!panel || !target) return;
  const wasHidden = !panel.hasAttribute('data-active');
  setActive(panel.dataset.tabPanel!);
  if (scroll && wasHidden) {
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
}

function onTabClick(ev: MouseEvent): void {
  if (!MOBILE.matches || !els?.panels.length) return; // desktop: plain anchor
  const tab = ev.currentTarget as HTMLAnchorElement;
  const id = tab.dataset.tab;
  if (!id) return;
  ev.preventDefault();
  setActive(id, { entered: true });
  const url = id === defaultTab ? location.pathname + location.search : `#${id}`;
  history.replaceState(history.state, '', url);
  scrollToPanels();
}

function onTabKeydown(ev: KeyboardEvent): void {
  if (!els || !MOBILE.matches) return;
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(ev.key)) return;
  ev.preventDefault();
  const current = els.tabs.findIndex((t) => t === ev.currentTarget);
  const last = els.tabs.length - 1;
  let next = current;
  if (ev.key === 'ArrowLeft') next = current <= 0 ? last : current - 1;
  if (ev.key === 'ArrowRight') next = current >= last ? 0 : current + 1;
  if (ev.key === 'Home') next = 0;
  if (ev.key === 'End') next = last;
  els.tabs[next]?.click();
  els.tabs[next]?.focus();
}

/** Same-page anchors into a hidden panel: show the panel, let the jump happen. */
function onDocumentClick(ev: MouseEvent): void {
  if (!els || !MOBILE.matches || !els.panels.length || ev.defaultPrevented) return;
  if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
  const link = (ev.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (!link || link.hasAttribute('data-tab')) return;
  const url = new URL(link.href, location.href);
  if (
    url.origin !== location.origin ||
    url.pathname !== location.pathname ||
    url.search !== location.search ||
    !url.hash
  )
    return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  const panel = panelOf(target);
  if (!panel || panel.hasAttribute('data-active')) return;
  setActive(panel.dataset.tabPanel!, { entered: true });
}

/** Tab semantics only while the phone layout is in effect. */
function syncRoles(): void {
  if (!els) return;
  const mobile = MOBILE.matches && els.panels.length > 0;
  for (const tab of els.tabs) {
    if (mobile) {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', tab.dataset.tab ?? '');
      const panel = els.panels.find((p) => p.dataset.tabPanel === tab.dataset.tab);
      const on = !!panel?.hasAttribute('data-active');
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
    } else {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-controls');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
    }
  }
  for (const p of els.panels) {
    if (mobile) {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', `tab-${p.dataset.tabPanel}`);
    } else {
      p.removeAttribute('role');
      p.removeAttribute('aria-labelledby');
    }
  }
  els.tabs.forEach((tab) => tab.id = `tab-${tab.dataset.tab}`);
  if (!mobile) for (const link of els.links) link.removeAttribute('aria-current');
}

// --- lifecycle ---------------------------------------------------------------

function init(): void {
  els = collect();
  if (!els) return;
  els.header.toggleAttribute('data-has-hero', !!els.hero);

  controller = new AbortController();
  const { signal } = controller;

  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', onScroll, { passive: true, signal });
  window.addEventListener('hashchange', () => applyHash(true), { signal });
  MOBILE.addEventListener('change', () => { syncRoles(); updateHeader(); }, { signal });
  document.addEventListener('click', onDocumentClick, { capture: true, signal });
  for (const tab of els.tabs) {
    tab.addEventListener('click', onTabClick, { signal });
    tab.addEventListener('keydown', onTabKeydown, { signal });
  }

  syncRoles();
  applyHash(true);
  updateHeader();
}

function teardown(): void {
  controller?.abort();
  controller = null;
  els = null;
}

document.addEventListener('astro:page-load', () => {
  teardown();
  init();
});

document.addEventListener('astro:before-swap', teardown);
