import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const screens = ['main','money','accounts','balance','more'];
const expectedPositions = ['main','main','money','accounts','balance','more'];
const pages = [
  'assets/tilda-v90/kapital-v90-remote.html',
  'assets/tilda-v90/kapital-v90-remote-q94.html',
];

for (const page of pages) {
  const html = readFileSync(new URL(page, root), 'utf8');
  const positions = [...html.matchAll(/data-kapital-screen="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(positions, expectedPositions, page + ' must place six phones correctly');
  assert.doesNotMatch(html, /data:image\/webp;base64|phones-equal\//i, page + ' contains old phone images');
  assert.doesNotMatch(html, /excel|эксел|эксель|xlsx|электронные таблиц/i,
    page + ' still mentions the old spreadsheet product');
  for (const name of screens) {
    assert.match(html, new RegExp('assets/tilda-v92/screens/' + name + '\\.webp'),
      page + ' has a missing link to ' + name);
  }
  assert.match(html, /<strong>461 880 ₽<\/strong>/, page);
  assert.match(html, /<strong>291 880 ₽<\/strong>/, page);
  assert.match(html, /<strong>102 000 ₽<\/strong>/, page);
  assert.match(html, /<strong>12 401 ₽<\/strong>/, page);
  console.log('HTML verified:', page);
}

for (const name of screens) {
  const file = new URL('assets/tilda-v92/screens/' + name + '.webp', root);
  const data = readFileSync(file); // Also blocks a release with missing assets.
  assert.ok(data.byteLength > 20_000 && data.byteLength < 1_000_000, name + ' asset size is unreasonable');
  assert.equal(data.toString('ascii',0,4),'RIFF',name + ' is not RIFF');
  assert.equal(data.toString('ascii',8,12),'WEBP',name + ' is not WebP');
  console.log(name, statSync(file).size, 'bytes');
}
