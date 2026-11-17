import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('kapital-7k.html', root), 'utf8');
const screens = ['main','main','money','accounts','balance','more'];
const labels = ['', 'Главная Капитал', 'Деньги Капитал', 'Счета Капитал', 'Баланс Капитал', 'Ещё Капитал'];
const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);

assert.equal(tags.length,6,'Only six screenshots are expected');
for(let i=0;i<screens.length;i++){
  assert.ok(tags[i].includes('alt="'+labels[i]+'"'),'Wrong screen order: '+labels[i]);
  assert.ok(tags[i].includes('/assets/tilda-v93/screens/'+screens[i]+'.webp'),'Old image remains: '+labels[i]);
  assert.ok(tags[i].includes('onerror="this.onerror=null;this.src='),'Image fallback missing: '+labels[i]);
  assert.ok(tags[i].includes('@master/assets/tilda-v93/screens/'),'Primary screenshot is not linked to the new CDN path: '+labels[i]);
  assert.ok(tags[i].includes('/assets/tilda-v92/screens/'+screens[i]+'.webp'),'Historical fallback missing: '+labels[i]);
  assert.ok(tags[i].includes('f306a390a76299d6b51ecd10dd6fb8f71d5fc9d7'),'Use a pinned, verified image revision');
}
assert.doesNotMatch(html,/phones-equal\/|data:image\/webp;base64/i);
assert.doesNotMatch(html,/excel|эксел|эксель|xlsx|электронные таблицы/i);
assert.match(html,/7 000 ₽/);
assert.match(html,/app\.lava\.top\/products\//);
assert.match(html,/kapital-v90-inline\.js/);
assert.match(html,/id="kapital-demo-visible-phone-equal-js-v4"/);
assert.match(html,/id="kapital-final-overrides"/);
assert.doesNotMatch(html,/5 000 ₽/);

// Static marketing examples must match the supplied November 2026 application screens.
for(const [amount,label] of [
  ['12 401 ₽','не распределено'],['88 140 ₽','отложено'],
  ['160 000 ₽','доходы'],['58 000 ₽','расходы'],['102 000 ₽','результат месяца'],['+92 449 ₽','выше плана'],
  ['291 158 ₽','всего на счетах'],['40%','доля RUB'],
  ['491 158 ₽','чистый капитал'],['14%','доля пассивов'],
  ['4','группы меню'],['11','пунктов меню'],
]) {
  assert.ok(html.includes('<strong>'+amount+'</strong><span>'+label+'</span>'), 'Outdated marketing fact: '+label+' = '+amount);
}
assert.doesNotMatch(html,/291 880 ₽|461 880 ₽/);
assert.match(html,/id="kapital-v93-screens-and-proof-fix"/);
assert.match(html,/\.m-slide-copy \.m-proof/);
assert.match(html,/border-top: 0 !important/);
console.log('Canonical user HTML: current figures, borderless proofs, screenshots and payment OK');

for(const name of new Set(screens)){
  const path = new URL('assets/tilda-v93/screens/'+name+'.webp',root);
  const bytes = readFileSync(path);
  assert.ok(bytes.byteLength>20000 && bytes.byteLength<1000000,name+' image size');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(bytes.toString('ascii',12,16),'VP8X');
  assert.equal(bytes.readUIntLE(24,3)+1,600,name+' width');
  assert.equal(bytes.readUIntLE(27,3)+1,1120,name+' height');
  console.log(name,statSync(path).size,'bytes');
}
for(const file of ['assets/kapital-1.css','assets/kapital-2.css','assets/kapital-3.css',
  'assets/tilda-v90/kapital-v90-inline.css','assets/tilda-v90/kapital-v90-inline.js',
  'assets/tilda-v90/hero-bg-2800.webp','assets/kapital-screens-03-06-sprite.webp']){
    assert.ok(statSync(new URL(file,root)).size>0,file+' is required');
}
console.log('Retained all required site dependencies');