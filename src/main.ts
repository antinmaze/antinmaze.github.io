import { createIcons, ArrowUpRight, ArrowDownRight, ArrowRight, ArrowUp, Linkedin, Github, MapPin, Layers3, Cloud, ShieldCheck, Code2, Blocks, Film, Video, Sparkles, MessageSquareText, Database, ScanText, AudioLines, Menu } from 'lucide';
import './style.css';
import { messages } from './translations';

const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
const text = messages[language];

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#navigation');
const themeButton = document.querySelector<HTMLButtonElement>('.theme-toggle');
const themeIcon = themeButton?.querySelector<HTMLSpanElement>('.theme-toggle__icon');

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  const nextThemeLabel = theme === 'dark' ? text.theme.switchToLight : text.theme.switchToDark;
  themeButton?.setAttribute('aria-label', nextThemeLabel);
  themeButton?.setAttribute('title', nextThemeLabel);
  themeButton?.setAttribute('aria-pressed', String(theme === 'light'));
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  }
}

function getPreferredTheme(): 'light' | 'dark' {
  try {
    const storedTheme = localStorage.getItem('portfolio-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
  } catch {
    // Ignore storage access issues in private browsing or restricted contexts.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setNavigationLabels() {
  const items = new Map<string, string>([
    ['#apropos', text.nav.about],
    ['#expertises', text.nav.expertise],
    ['#projets', text.nav.projects],
    ['#musique', text.nav.music],
    ['#contact', text.nav.contact],
  ]);

  navigation?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    const label = items.get(link.getAttribute('href') ?? '');
    if (!label) return;

    const textNode = Array.from(link.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    if (textNode) {
      textNode.textContent = label;
      return;
    }

    link.textContent = label;
  });

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.textContent = text.skipLink;

  const languageToggle = document.querySelector('.language-switch');
  if (languageToggle) languageToggle.setAttribute('aria-label', text.nav.chooseLanguage);

  const homeLink = document.querySelector<HTMLAnchorElement>('.brand');
  if (homeLink) homeLink.setAttribute('aria-label', text.nav.home);
}

// Keep the section when following the language link; normal links also work without JS.
function updateLanguageLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach((link) => {
    const path = link.dataset.language === 'en' ? '/en/' : '/';
    link.href = `${path}${window.location.hash}`;
  });
}
updateLanguageLinks();
setNavigationLabels();
applyTheme(getPreferredTheme());
window.addEventListener('hashchange', updateLanguageLinks);

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch {
      // Ignore storage access issues in private browsing or restricted contexts.
    }
  });
}

createIcons({ icons: { ArrowUpRight, ArrowDownRight, ArrowRight, ArrowUp, Linkedin, Github, MapPin, Layers3, Cloud, ShieldCheck, Code2, Blocks, Film, Video, Sparkles, MessageSquareText, Database, ScanText, AudioLines, Menu } });

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', text.openMenu);
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? text.openMenu : text.closeMenu);
  navigation?.classList.toggle('is-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (event.target instanceof Node && !navigation?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

const filters = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const projects = document.querySelectorAll<HTMLElement>('[data-category]');
filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((filter) => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    let count = 0;
    projects.forEach((project) => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    });
    const status = document.querySelector('.filter-status');
    if (status) status.textContent = text.projects(count);
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window) {
  const links = navigation?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links?.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}