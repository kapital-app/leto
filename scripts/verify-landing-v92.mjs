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
  assert.ok(tags[i].includes('/assets/tilda-v92/screens/'+screens[i]+'.webp'),'Old image remains: '+labels[i]);
  assert.ok(tags[i].includes('onerror="this.onerror=null;this.src='),'Image fallback missing: '+labels[i]);
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
console.log('Canonical user HTML: images, copy and payment OK');

for(const name of new Set(screens)){
  const path = new URL('assets/tilda-v92/screens/'+name+'.webp',root);
  const bytes = readFileSync(path);
  assert.ok(bytes.byteLength>20000 && bytes.byteLength<1000000,name+' image size');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  console.log(name,statSync(path).size,'bytes');
}
for(const file of ['assets/kapital-1.css','assets/kapital-2.css','assets/kapital-3.css',
  'assets/tilda-v90/kapital-v90-inline.css','assets/tilda-v90/kapital-v90-inline.js',
  'assets/tilda-v90/hero-bg-2800.webp','assets/kapital-screens-03-06-sprite.webp']){
    assert.ok(statSync(new URL(file,root)).size>0,file+' is required');
}
console.log('Retained all required site dependencies');