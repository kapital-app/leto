import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('kapital-7k.html', root), 'utf8');
const screens = ['main','main','money','accounts','balance','more'];
const labels = ['', 'Главная Капитал', 'Деньги Капитал', 'Счета Капитал', 'Баланс Капитал', 'Ещё Капитал'];
const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);

assert.equal(tags.length,6,'Only six screenshots are expected');
for(let i=0;i<screens.length;i++){
  assert.ok(tags[i].includes('alt="'+labels[i]+'"'),'Wrong screen order: '+labels[i]);
  assert.ok(tags[i].includes('/assets/tilda-v94/screens/'+screens[i]+'.webp'),'Updated image missing: '+labels[i]);
  assert.ok(tags[i].includes('onerror="this.onerror=null;this.src='),'Image fallback missing: '+labels[i]);
  assert.ok(tags[i].includes('@master/assets/tilda-v94/screens/'),'Primary screenshot is not linked to the new CDN path: '+labels[i]);
  assert.ok(tags[i].includes('https://raw.githubusercontent.com/kapital-app/leto/master/assets/tilda-v94/screens/'+screens[i]+'.webp'),'VPN-free fallback missing: '+labels[i]);
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

const fixed = {
  main:'2e8ed1d2a467444f88613fc1546db0b46e7b02bb0a4c6fee9f4f3f5f1219787a',
  money:'8236d37c8b24b19cc1da74b562c14a94c18caf81135553c315f6622013d9bad2',
  accounts:'6a762f0eaea86345387aee12860b3786adb68df116c8b0381277a816e6063bf6',
  balance:'682915356d1cba61c506e0987c155b619531acf4d96ae5428db5e2aae6a8754a',
  more:'d29d4315688f93ce8fbe059ef3d1f0b4fa6825d135e9a742eccb6c398be9d9d3'
};
for(const name of new Set(screens)){
  for(const version of ['tilda-v93','tilda-v94']){
  const path = new URL('assets/'+version+'/screens/'+name+'.webp',root);
  const bytes = readFileSync(path);
  assert.ok(bytes.byteLength>20000 && bytes.byteLength<1000000,name+' image size');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(bytes.toString('ascii',12,16),'VP8X');
  assert.equal(bytes.readUIntLE(24,3)+1,600,name+' width');
  assert.equal(bytes.readUIntLE(27,3)+1,1120,name+' height');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),fixed[name],version+'/'+name+' differs from approved VPN-free image');
  console.log(version,name,statSync(path).size,'bytes');
  }
}
for(const file of ['assets/kapital-1.css','assets/kapital-2.css','assets/kapital-3.css',
  'assets/tilda-v90/kapital-v90-inline.css','assets/tilda-v90/kapital-v90-inline.js',
  'assets/tilda-v90/hero-bg-2800.webp','assets/kapital-screens-03-06-sprite.webp']){
    assert.ok(statSync(new URL(file,root)).size>0,file+' is required');
}
console.log('Retained all required site dependencies');