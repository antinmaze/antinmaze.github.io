import { createIcons, ArrowUpRight, ArrowDownRight, ArrowRight, ArrowUp, Linkedin, Github, MapPin, Layers3, Cloud, ShieldCheck, Code2, Blocks, Film, Video, Sparkles, MessageSquareText, Database, ScanText, AudioLines, Menu } from 'lucide';
import './style.css';
import { messages } from './translations';

const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
const text = messages[language];

// Keep the section when following the language link; normal links also work without JS.
function updateLanguageLinks() {
  document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach((link) => {
    const path = link.dataset.language === 'en' ? '/en/' : '/';
    link.href = `${path}${window.location.hash}`;
  });
}
updateLanguageLinks();
window.addEventListener('hashchange', updateLanguageLinks);

createIcons({ icons: { ArrowUpRight, ArrowDownRight, ArrowRight, ArrowUp, Linkedin, Github, MapPin, Layers3, Cloud, ShieldCheck, Code2, Blocks, Film, Video, Sparkles, MessageSquareText, Database, ScanText, AudioLines, Menu } });

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const navigation = document.querySelector<HTMLElement>('#navigation');

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