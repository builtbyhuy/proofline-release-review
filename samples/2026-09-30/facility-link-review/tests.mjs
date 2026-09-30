import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const source=html.match(/<script id="review-core">([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Inline core exists');
const sandbox={URL};
vm.createContext(sandbox);vm.runInContext(source,sandbox);
const api=sandbox.FacilityLinkReview;
const plain=x=>JSON.parse(JSON.stringify(x));
const expected=[
'https://www.monolithcapital.com/','https://www.waycapital.com/',
'https://www.thelasvegasnightowls.com/','https://www.devtec.net/',
'https://hirshmark.com/','https://www.tenthavenuegroup.com/'
];
test('six source observations match exact public destination list',()=>{
 assert.deepEqual(plain(api.manifest.map(r=>r.url)),expected);
 assert.equal(new Set(api.manifest.map(r=>r.id)).size,6);
 assert.ok(api.manifest.every(r=>r.observedLabel==='Visit Website'));
 assert.ok(api.manifest.every(r=>r.demoLabel.includes(new URL(r.url).hostname.replace(/^www\./,''))));
});
test('manifest.json and self-contained HTML retain the same observations',()=>{
 const file=JSON.parse(readFileSync(new URL('./manifest.json',import.meta.url),'utf8'));
 assert.deepEqual(file.records,plain(api.manifest));
 assert.equal(file.observedDate,'2026-09-30');
});
test('published fixture passes only local checks, never implies live testing',()=>{
 const result=api.report('published');
 assert.equal(result.reviewFlagCount,0);
 assert.equal(result.liveChecksPerformed,false);
 assert.equal(result.synthetic,false);
 assert.equal(result.records.length,6);
});
test('practice injects exactly three known review flags',()=>{
 const data=api.report('practice');
 assert.equal(data.reviewFlagCount,3);
 assert.equal(data.synthetic,true);
 assert.deepEqual(plain(data.records.flatMap(r=>r.flags.map(f=>f.code))),[
 'EMPTY_DEMO_LABEL','DUPLICATE_DESTINATION','UNSAFE_OR_INVALID_URL'
 ]);
 assert.equal(data.records[2].safeDestination,null);
});
test('practice and edited clones cannot mutate the published manifest',()=>{
 const before=JSON.stringify(api.manifest);
 const cloned=api.dataset('practice');cloned[3].url='https://example.org/';
 assert.equal(JSON.stringify(api.manifest),before);
 assert.equal(api.report('published').reviewFlagCount,0);
 assert.equal(api.manifest[1].url,expected[1]);
});
test('unsafe schemes, credentials, local hosts and obfuscated separators rejected',()=>{
 for(const value of ['javascript:alert(1)','data:text/html,unsafe','//example.com/',
 'http://example.com/','https://name:secret@example.com/','https://localhost/',
 'https://127.0.0.1/','https://[::1]/','https://private.local/','https://example.com:9443/',
 ' https://example.com/','https://example.com/\n','https:\\\\example.com/','bad URL','',null]){
  assert.equal(api.safeUrl(value).ok,false,String(value));
 }
});
test('absolute public HTTPS URLs accepted without network and fragments normalized',()=>{
 assert.equal(api.safeUrl('https://EXAMPLE.com:443/#section').canonical,'https://example.com/');
 assert.equal(api.safeUrl('https://example.com/path?q=one').canonical,'https://example.com/path?q=one');
});
test('duplicates normalized across fragment/default port, paths preserved',()=>{
 const rows=[
 {id:'A',demoLabel:'A',url:'https://example.com/#one'},
 {id:'B',demoLabel:'B',url:'https://EXAMPLE.com:443/#two'},
 {id:'C',demoLabel:'C',url:'https://example.com/different'}
 ];
 const reviewed=api.review(rows);
 assert.equal(reviewed[0].flags.length,0);
 assert.equal(reviewed[1].flags[0].code,'DUPLICATE_DESTINATION');
 assert.equal(reviewed[2].flags.length,0);
});
test('missing or whitespace labels flagged without overwriting original record',()=>{
 const row={id:'X',demoLabel:' \t ',url:'https://example.com/'};
 assert.equal(api.review([row])[0].flags[0].code,'EMPTY_DEMO_LABEL');
 assert.equal(row.demoLabel,' \t ');
 assert.equal(api.review([{id:'Y',url:'https://example.org/'}])[0].flags[0].code,'EMPTY_DEMO_LABEL');
});
test('unknown mode rejected rather than silently represented as source data',()=>{
 assert.throws(()=>api.dataset('production'));
});
test('export is valid JSON with source date, limitations and synthetic provenance',()=>{
 const parsed=JSON.parse(JSON.stringify(api.report('practice')));
 assert.equal(parsed.source,'https://www.facilitydesignco.com/');
 assert.equal(parsed.observedDate,'2026-09-30');
 assert.ok(parsed.records[0].syntheticChanges.length);
 assert.ok(parsed.limitations.some(s=>s.includes('No claim')));
});
test('static page contains no remote assets, form submissions or DOM HTML injection',()=>{
 assert.match(html,/connect-src 'none'/);
 assert.match(html,/form-action 'none'/);
 assert.doesNotMatch(html,/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/);
 assert.doesNotMatch(html,/<(?:script|img|iframe)\b[^>]*\bsrc\s*=/i);
 assert.doesNotMatch(html,/<link\b[^>]*\bhref\s*=/i);
 assert.doesNotMatch(html,/\b(?:innerHTML|outerHTML)\s*=/);
 assert.doesNotMatch(html,/<form\b/i);
});

