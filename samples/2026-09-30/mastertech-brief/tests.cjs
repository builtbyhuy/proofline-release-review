"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const config=require("./config.js");
const {validate,compose,activeFields}=require("./app.js");
let passed=0;
function test(name,fn){fn();passed++;console.log("PASS",name);}
const example={...config.example};
test("synthetic fixture generates parseable independent JSON",()=>{const r=compose(config,example,"synthetic fixture");assert.deepEqual(r.errors,[]);const p=JSON.parse(r.json);assert.equal(p.prototype.independent_prototype,true);assert.equal(p.prototype.endorsed_or_deployed,false);assert.equal(p.prototype.input_origin,"synthetic fixture");assert.equal(r.payload.prototype.destination_company,config.company);});
test("invalid email rejected",()=>assert(validate(config,{...example,email:"not-an-email"}).some(e=>e.id==="email")));
test("blank required field rejected",()=>{const f=activeFields(config,example).find(f=>f.required);assert(validate(config,{...example,[f.id]:"  "}).some(e=>e.id===f.id));});
test("invalid optional URL rejected only in active branch",()=>{const f=activeFields(config,example).find(f=>f.type==="url");if(f)assert(validate(config,{...example,[f.id]:"javascript:alert(1)"}).some(e=>e.id===f.id));else assert.equal(validate(config,example).length,0);});
test("HTML-like message preserved as inert export data",()=>{const key=config.kind==="splash"?"goal":"message";const message='<img src=x onerror="globalThis.pwned=true">\n<script>alert(1)</script>';const r=compose(config,{...example,[key]:message});assert.equal(r.errors.length,0);assert(r.json.includes("onerror"));assert(r.summary.includes(message));assert.equal(globalThis.pwned,undefined);});
test("long message survives JSON round trip",()=>{const key=config.kind==="splash"?"goal":"message";const message="first line\n"+"long message ".repeat(1500)+"\nlast line";const r=compose(config,{...example,[key]:message});assert(r.summary.includes(message));assert.equal(JSON.parse(r.json)[config.kind==="master"?"inquiry":config.kind==="splash"?"brief":"message"]?.project_description || (config.kind==="splash" ? JSON.parse(r.json).brief.goal : JSON.parse(r.json).message),message);});
test("no executable input rendering or remote clients",()=>{const code=fs.readFileSync(path.join(__dirname,"app.js"),"utf8");assert(!/innerHTML|outerHTML|insertAdjacentHTML|eval\(|fetch\(|XMLHttpRequest|WebSocket|sendBeacon/.test(code));const html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8");assert(html.includes("connect-src 'none'"));assert(html.includes("form-action 'none'"));});
if(config.kind==="splash"){
 test("project and freelance output contain only relevant fields",()=>{const p=compose(config,{...example,website:""});const f=compose(config,{...example,intent:"freelance"});assert(p.subject.startsWith("[Project enquiry]"));assert(f.subject.startsWith("[Freelance introduction]"));assert.equal(p.payload.contact.website,null);assert(!("portfolio" in p.payload.brief));assert(!("goal" in f.payload.brief));assert.equal(f.payload.contact.name,p.payload.contact.name);});
 test("hidden freelance URL cannot invalidate project",()=>assert.equal(validate(config,{...example,portfolio:"javascript:alert(1)"}).length,0));
 test("freelance skill required",()=>assert(validate(config,{...example,intent:"freelance",skill:""}).some(e=>e.id==="skill")));
} else if(config.kind==="mother"){
 test("all three intents produce distinct subjects and preserve message",()=>{const out=config.branches.map(b=>compose(config,{...example,intent:b.value}));assert.equal(new Set(out.map(r=>r.subject)).size,3);for(const r of out)assert.equal(r.payload.message,example.message);assert.deepEqual(out[2].payload.context,{});});
 test("subject strips line breaks without rewriting original",()=>{const r=compose(config,{...example,subject:"Brief\nBcc: nobody@example.com"});assert(!r.subject.includes("\n"));assert.equal(r.payload.original_subject,"Brief\nBcc: nobody@example.com");});
} else {
 test("missing values stay null and are flagged",()=>{const p=compose(config,example).payload;assert.equal(p.inquiry.company_name,null);assert.equal(p.optional_prototype_fields.timeline,null);assert.equal(p.optional_prototype_fields.budget,null);assert.deepEqual(p.missing_information,["company_name","timeline","budget"]);});
 test("supplied extra context retained without inference",()=>{const p=compose(config,{...example,company:"Synthetic Co",timeline:"To discuss",budget:"Undecided"}).payload;assert.equal(p.optional_prototype_fields.budget,"Undecided");assert.deepEqual(p.missing_information,[]);});
 test("only published selector values allowed",()=>{assert(validate(config,{...example,interest:"made-up-service"}).some(e=>e.id==="interest"));assert.equal(compose(config,{...example,interest:"web"}).payload.inquiry.interest.label,"Website Design & Development");});
}
console.log(`${passed} tests passed for ${config.company}`);
