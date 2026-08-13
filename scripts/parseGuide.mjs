#!/usr/bin/env node
// Convierte una guía HTML (formato heredado, con h2/h3/p/figure/svg) al JSON de guía.
// Uso: node scripts/parseGuide.mjs <input.html> <output.json> <guideId> [--plan section_index=url|caption|credit ...]

import fs from 'node:fs';
import path from 'node:path';

const [, , inputPath, outputPath, guideId, ...rest] = process.argv;

if (!inputPath || !outputPath || !guideId) {
  console.error('Uso: node parseGuide.mjs <input.html> <output.json> <guideId> [--plan idx=url|caption|credit]');
  process.exit(1);
}

const html = fs.readFileSync(inputPath, 'utf8');

function slug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripTags(str) {
  return decodeEntities(str.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
const subtitleMatch = html.match(/<p[^>]*class="subtitle"[^>]*>([\s\S]*?)<\/p>/);
const title = titleMatch ? stripTags(titleMatch[1]) : 'Guía';
const subtitle = subtitleMatch ? stripTags(subtitleMatch[1]) : '';

const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
const mainHtml = mainMatch ? mainMatch[1] : html;

const tokenRegex =
  /<h2[^>]*>([\s\S]*?)<\/h2>|<h3[^>]*>([\s\S]*?)<\/h3>|<p[^>]*>([\s\S]*?)<\/p>|<figure[^>]*>([\s\S]*?)<\/figure>/g;

const sections = [];
let currentH2 = null;
let currentH3 = null;
let figCount = 0;

function currentContainer() {
  if (!currentH2) return null;
  if (currentH3) return currentH3;
  return currentH2;
}

let m;
while ((m = tokenRegex.exec(mainHtml)) !== null) {
  const [, h2, h3, p, figInner] = m;
  if (h2 !== undefined) {
    const t = stripTags(h2);
    currentH2 = {
      id: slug(t),
      level: 2,
      title: t,
      paragraphs: [],
      figures: [],
      subsections: [],
    };
    currentH3 = null;
    sections.push(currentH2);
  } else if (h3 !== undefined) {
    if (!currentH2) continue;
    const t = stripTags(h3);
    currentH3 = {
      id: slug(t),
      level: 3,
      title: t,
      paragraphs: [],
      figures: [],
    };
    currentH2.subsections.push(currentH3);
  } else if (p !== undefined) {
    const c = currentContainer();
    if (!c) continue;
    const txt = stripTags(p);
    if (txt.length) c.paragraphs.push(txt);
  } else if (figInner !== undefined) {
    const c = currentContainer();
    if (!c) continue;
    figCount++;
    const capMatch = figInner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
    const svgMatch = figInner.match(/<svg[\s\S]*?<\/svg>/);
    const rawCap = capMatch ? stripTags(capMatch[1]) : '';
    const fignumMatch = rawCap.match(/^(Plano [IVX]+|Fig\.\s*\d+)\.?\s*(.*)$/);
    const fignum = fignumMatch ? fignumMatch[1] : `Fig. ${figCount}`;
    const caption = fignumMatch ? fignumMatch[2] : rawCap;
    if (svgMatch) {
      c.figures.push({
        type: 'svg',
        fignum,
        caption,
        svg: svgMatch[0],
        credit: 'Diagrama esquemático de la guía',
      });
    }
  }
}

// Limpiar subsections vacíos
for (const s of sections) {
  if (!s.subsections.length) delete s.subsections;
}

const output = { id: guideId, title, subtitle, sections };

// Insertar planos externos si se pasaron con --plan idx=url|caption|credit
const plans = rest
  .filter((a) => a.startsWith('--plan='))
  .map((a) => a.slice('--plan='.length))
  .filter(Boolean);
for (const plan of plans) {
  const eqIdx = plan.indexOf('=');
  if (eqIdx < 0) continue;
  const target = plan.slice(0, eqIdx);
  const [url, caption, credit, alt] = plan.slice(eqIdx + 1).split('|');
  const [secIdxRaw, subIdxRaw] = target.split(':');
  const secIdx = parseInt(secIdxRaw, 10);
  const subIdx = subIdxRaw !== undefined ? parseInt(subIdxRaw, 10) : null;
  const sec = output.sections[secIdx];
  if (!sec) continue;
  const container = subIdx !== null ? sec.subsections?.[subIdx] : sec;
  if (!container) continue;
  container.figures = container.figures || [];
  container.figures.unshift({
    type: 'image',
    fignum: 'Plano histórico',
    caption,
    src: url,
    alt: alt || caption,
    credit,
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

let figTotal = 0;
for (const s of output.sections) {
  figTotal += s.figures.length;
  for (const sub of s.subsections || []) figTotal += sub.figures.length;
}
console.log(`OK: ${outputPath} · ${sections.length} secciones, ${figTotal} figuras`);
