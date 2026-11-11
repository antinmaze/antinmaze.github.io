import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';
import { english } from '../src/translations';

type Node = DefaultTreeAdapterMap['node'];

/** Generate English HTML at build time: readable without JavaScript and indexable. */
export function localizeEnglish(html: string): string {
  const document = parse(html);
  const translate = (value: string) => {
    const key = value.trim();
    const translated = english[key];
    return translated ? value.replace(key, translated) : value;
  };

  function visit(node: Node) {
    if (node.nodeName === '#text' && 'value' in node) node.value = translate(node.value);
    if ('attrs' in node) {
      for (const attr of node.attrs) {
        if (['aria-label', 'title', 'content', 'alt'].includes(attr.name)) attr.value = translate(attr.value);
        if (node.tagName === 'html' && attr.name === 'lang') attr.value = 'en';
        if (attr.name === 'content' && attr.value === 'fr_FR') attr.value = 'en_GB';
        const isCanonical = node.attrs.some((item) => item.name === 'rel' && item.value === 'canonical');
        const isOgUrl = node.attrs.some((item) => item.name === 'property' && item.value === 'og:url');
        if ((isCanonical && attr.name === 'href') || (isOgUrl && attr.name === 'content')) attr.value = 'https://antoinemaze.fr/en/';
      }
      const language = node.attrs.find((attr) => attr.name === 'data-language')?.value;
      if (language) {
        node.attrs = node.attrs.filter((attr) => attr.name !== 'aria-current');
        if (language === 'en') node.attrs.push({ name: 'aria-current', value: 'page' });
      }
      if (node.tagName === 'script' || node.tagName === 'style') return;
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  return serialize(document);
}