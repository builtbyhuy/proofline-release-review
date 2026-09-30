"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const {pathToFileURL} = require("node:url");
const config = require("./config.js");
let playwright;
try { playwright = require("playwright"); }
catch { playwright = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES || "", "playwright")); }
(async () => {
 const browser = await playwright.chromium.launch({headless:true,args:["--no-sandbox"]});
 const page = await browser.newPage({viewport:{width:1280,height:960}});
 const errors = [], external = [];
 page.on("pageerror",e=>errors.push(e.message));
 page.on("request",r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await page.goto(pathToFileURL(path.join(__dirname,"index.html")).href);
 await page.locator("#load-example").click();
 await page.locator("button[type=submit]").click();
 assert((await page.locator("#preview").inputValue()).includes("synthetic example"));
 assert.equal(await page.locator("#download").isDisabled(),false);
 if(config.branches.length){
  const field=config.kind==="splash"?"name":"message";
  const before=await page.locator("#"+field).inputValue();
  await page.locator("#intent").selectOption("freelance");
  assert.equal(await page.locator("#"+field).inputValue(),before);
  assert.equal(await page.locator('[data-branch="project"]').first().isVisible(),false);
  assert.equal(await page.locator("#download").isDisabled(),true);
  await page.locator("button[type=submit]").click();
  assert((await page.locator("#subject-output").innerText()).includes("Freelance introduction"));
 }
 await page.locator("#email").fill("bad-email");
 await page.locator("button[type=submit]").click();
 assert.equal(await page.evaluate(()=>document.activeElement.id),"email");
 assert.equal(await page.locator("#download").isDisabled(),true);
 await page.locator("#load-example").click();
 const target=config.kind==="splash"?"goal":"message";
 const literal='<img src=x onerror="window.sampleInjected=1">'+"\n"+"A long draft ".repeat(1000);
 await page.locator("#"+target).fill(literal);
 await page.locator("button[type=submit]").click();
 assert((await page.locator("#preview").inputValue()).includes(literal));
 assert.equal(await page.evaluate(()=>window.sampleInjected),undefined);
 assert.equal(await page.locator("img").count(),0);
 const [download]=await Promise.all([page.waitForEvent("download"),page.locator("#download").click()]);
 const stream=await download.createReadStream();const parts=[];for await(const part of stream)parts.push(part);
 const data=JSON.parse(Buffer.concat(parts).toString("utf8"));
 assert.equal(data.prototype.independent_prototype,true);
 assert.equal(data.prototype.endorsed_or_deployed,false);
 if(config.kind==="master"){assert.equal(data.inquiry.company_name,null);assert.deepEqual(data.missing_information,["company_name","timeline","budget"]);}
 await page.locator("#reset").click();
 assert.equal(await page.locator("#email").inputValue(),"");
 assert.equal(await page.locator("#preview").inputValue(),"");
 assert.equal(await page.locator("#copy").isDisabled(),true);
 await page.locator("#load-example").click();await page.locator("button[type=submit]").click();
 await page.locator("#copy").click();
 assert(/copied|selected/.test(await page.locator("#status").innerText()));
 fs.mkdirSync(path.join(__dirname,".test-output"),{recursive:true});
 await page.screenshot({path:path.join(__dirname,".test-output","desktop.png"),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),"no horizontal overflow at 390px");
 await page.screenshot({path:path.join(__dirname,".test-output","mobile.png"),fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 await browser.close();
 console.log("PASS browser: branching/preservation, validation focus, inert text, long message, local JSON download, reset, copy fallback, 390px layout, zero external requests");
})().catch(e=>{console.error(e);process.exitCode=1;});
