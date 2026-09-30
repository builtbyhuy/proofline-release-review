import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const requests=[],errors=[];
page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',route=>/^https?:/.test(route.request().url())?route.abort():route.continue());
try{
 await page.goto(new URL('./index.html',import.meta.url).href);
 await assert.equal(await page.locator('.card').count(),6);
 assert.equal(await page.locator('#flag-count').textContent(),'0');
 assert.equal(await page.locator('.cards a').count(),6);
 await page.locator('input[value="practice"]').check();
 assert.equal(await page.locator('#flag-count').textContent(),'3');
 assert.equal(await page.locator('.flag').count(),3);
 assert.equal(await page.locator('.cards a').count(),0);
 assert.match(await page.locator('#mode-note').textContent(),/SYNTHETIC PRACTICE/);
 await page.locator('input[value="published"]').check();
 assert.equal(await page.locator('#flag-count').textContent(),'0');
 assert.equal(await page.locator('.cards a').count(),6);
 // The native radio group supports keyboard switching with the same visible result.
 await page.locator('input[value="published"]').focus();
 await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('#flag-count').textContent(),'3');
 await page.keyboard.press('ArrowLeft');
 assert.equal(await page.locator('#flag-count').textContent(),'0');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#download').click();
 const download=await downloadPromise;
 assert.equal(download.suggestedFilename(),'facility-published-local-review.json');
 const path=await download.path();
 const {readFile}=await import('node:fs/promises');
 const report=JSON.parse(await readFile(path,'utf8'));
 assert.equal(report.synthetic,false);
 assert.equal(report.liveChecksPerformed,false);
 for(const width of [360,768,1280]){
  await page.setViewportSize({width,height:900});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  assert.equal(overflow,false,'No document-level horizontal overflow at '+width);
 }
 await page.setViewportSize({width:1280,height:900});
 await page.screenshot({path:fileURLToPath(new URL('./preview-desktop.png',import.meta.url)),fullPage:true});
 await page.setViewportSize({width:360,height:900});
 await page.screenshot({path:fileURLToPath(new URL('./preview-mobile.png',import.meta.url)),fullPage:true});
 assert.deepEqual(requests,[],'No automatic HTTP(S) requests');
 assert.deepEqual(errors,[],'No browser errors');
 console.log('PASS: 6 records; clean/practice/reset; 3 exact flags; keyboard radios; safe practice links; JSON download; 360/768/1280 widths; zero HTTP(S) requests; zero browser errors.');
}finally{await browser.close();}
