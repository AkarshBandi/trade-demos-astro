#!/usr/bin/env node
// Simple local AI slop detector — checks prototypes for human-made principles
// Checks: purple gradient, Inter, pill badge+centered hero, 3 cards, zinc, Elevate/Seamless, uniform fade-up, backdrop-blur, etc.
// Exit 2 if P0/P1 found, 0 if clean. Human override: add // avoid-ai-design-ignore: ID
import fs from 'node:fs';
import path from 'node:path';

const files = process.argv.slice(2).filter(a=>!a.startsWith('--')) ;
const checkFiles = files.length ? files : ['src/pages/prototype.astro','src/pages/roofing-prototype.astro'];
const patterns = [
  {id:'C1',sev:'P0',name:'Purple/indigo gradient',re:/linear-gradient\([^)]*#6366f1|#8b5cf6|from-indigo|via-purple/i,why:'indigo gradient default'},
  {id:'T1',sev:'P0',name:'Inter as primary',re:/font-family[^;]*Inter/i,why:'Inter default'},
  {id:'L1',sev:'P0',name:'Pill badge + centered hero',re:/rounded-full[^]*<h1[^>]*style[^>]*text-center|pill.*badge.*centered/i,why:'centered hero with pill'},
  {id:'L2',sev:'P0',name:'3 identical icon cards',re:/grid-cols-3[^]*rounded-.*shadow/s,why:'3 equal cards pattern'},
  {id:'K1',sev:'P0',name:'Untouched shadcn zinc',re:/--primary:\s*oklch\(0\.205|baseColor.*zinc/i,why:'zinc base'},
  {id:'CP1',sev:'P1',name:'Vague headline Elevate/Seamless',re:/Elevate your|Seamless|Cutting-edge|Powerful|Bespoke/i,why:'beige superlative'},
  {id:'M1',sev:'P2',name:'Uniform fade-up',re:/initial=\{\{opacity:0.*y:\d+|data-aos=.fade-up/i,why:'same fade-up everywhere'},
  {id:'K3',sev:'P1',name:'Glassmorphism backdrop-blur',re:/backdrop-blur|backdrop-filter:\s*blur/i,why:'frosted glass by reflex'},
  {id:'SD1',sev:'P1',name:'Cream+terracotta Claude look',re:/#F4F1EA|#f4f1ea|terracotta.*cream/i,why:'warm cream+terracotta cluster'},
];

let found=0;
for(const f of checkFiles){
  let text;
  try{ text=fs.readFileSync(f,'utf8'); }catch{ console.error(`skip ${f}: not found`); continue; }
  console.log(`\n${f}`);
  for(const p of patterns){
    if(p.re.test(text)){
      const sev=p.sev==='P0'?'\x1b[31;1mP0\x1b[0m':p.sev==='P1'?'\x1b[33;1mP1\x1b[0m':'\x1b[36mP2\x1b[0m';
      console.log(`  ${sev} ${p.id} ${p.name} — ${p.why}`);
      if(p.sev==='P0'||p.sev==='P1') found++;
    }
  }
}
console.log(`\n${found} P0/P1 findings`);
process.exit(found?2:0);
