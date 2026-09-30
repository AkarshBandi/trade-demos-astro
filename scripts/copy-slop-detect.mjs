#!/usr/bin/env node
// Copy-slop detector — enforces petergyang/no-ai-slop (skills/no-ai-slop/SKILL.md)
// on visible page copy: banned words, throat-clearing, faux-insight, binary
// contrasts, importance puffery, weasel attribution, fake-profound endings.
// Usage: node scripts/copy-slop-detect.mjs [files...] (defaults below)
// Exit 2 if P0/P1 found, 0 if clean. Human override: <!-- copy-slop-ignore: ID -->
import fs from 'node:fs';

const files = process.argv.slice(2).filter(a=>!a.startsWith('--'));
const checkFiles = files.length ? files : [
  'src/pages/prototype.astro',
  'src/pages/roofing-prototype.astro',
  'src/content/page/hvac.mdx',
  'src/content/page/roofing.mdx',
  'src/content/page/home.mdx',
];
// Strip code/CSS/JS so we only scan human-visible copy
const strip = (t) => t
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/---[\s\S]*?---/, ' ') // frontmatter handled separately below
  .replace(/<[^>]+>/g, ' ');
const patterns = [
  {id:'W1',sev:'P0',name:'Banned AI words',re:/\b(delve|foster|leverage|utilize|facilitate|empower|streamline|robust|cutting-edge|paradigm shift|game changer|this is huge|this changes everything|tapestry|realm|beacon|multifaceted|meticulous|intricate|paramount|transformative|elevate|embark|supercharge|harness|ever-evolving|seamless|revolutionary|next generation)\b/i,why:'no-ai-slop words-to-cut list'},
  {id:'W2',sev:'P1',name:'Throat-clearing opener',re:/\b(here'?s the thing|let me be clear|i'?ll be honest|the uncomfortable truth is|here'?s what i mean)\b/i,why:'cut setup, state the point'},
  {id:'W3',sev:'P1',name:'Faux-insight setup',re:/\b(what (most people|nobody) (get wrong|tells you)|the part (everyone misses|most people skip)|here'?s what nobody tells you)\b/i,why:'let the claim stand alone'},
  {id:'W4',sev:'P1',name:'Binary contrast',re:/\b(it'?s not \w[^.]{0,60}\. it'?s |the question isn'?t [^.]{0,60},? it'?s )/i,why:'state Y directly'},
  {id:'W5',sev:'P1',name:'Importance puffery',re:/\b(marks? a pivotal moment|a testament to|proud to announce|thrilled to)\b/i,why:'show facts, not importance'},
  {id:'W6',sev:'P1',name:'Weasel attribution',re:/\b(experts agree|studies show|research shows|it is widely (known|accepted))\b/i,why:'name sources or cut'},
  {id:'W7',sev:'P2',name:'Fake-profound ending',re:/\b(the future isn'?t coming\.? it'?s already here)\b/i,why:'end on concrete point'},
  {id:'W8',sev:'P1',name:'Generic CTA',re:/>(get started|learn more|try now|explore|discover|click here)</i,why:'CTA must say the action'},
  {id:'W9',sev:'P1',name:'Fake stats w/o source',re:/\b(10k\+ users|99\.9% uptime|500m requests|120\+ countries)\b/i,why:'no numbers without source'},
];

let found=0;
for(const f of checkFiles){
  let text;
  try{ text=fs.readFileSync(f,'utf8'); }catch{ console.error(`skip ${f}: not found`); continue; }
  if(text.includes('copy-slop-ignore-file')) continue;
  const visible = strip(text);
  console.log(`\n${f}`);
  for(const p of patterns){
    const m = visible.match(p.re);
    if(m && !text.includes(`copy-slop-ignore: ${p.id}`)){
      const sev=p.sev==='P0'?'\x1b[31;1mP0\x1b[0m':p.sev==='P1'?'\x1b[33;1mP1\x1b[0m':'\x1b[36mP2\x1b[0m';
      console.log(`  ${sev} ${p.id} ${p.name} — ${p.why} :: "${m[0].trim().slice(0,80)}"`);
      if(p.sev==='P0'||p.sev==='P1') found++;
    }
  }
}
console.log(`\n${found} P0/P1 findings`);
process.exit(found?2:0);
