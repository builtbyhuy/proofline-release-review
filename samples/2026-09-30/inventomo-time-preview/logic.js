(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.TimePreview=api;})(globalThis,function(){
"use strict";
const zones=["UTC","Asia/Karachi","America/New_York","Asia/Ho_Chi_Minh"];
function dateParts(date,time){
if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))throw new Error("Choose a complete date and time.");
const [year,month,day]=date.split("-").map(Number);const [hour,minute]=time.split(":").map(Number);
const probe=new Date(Date.UTC(year,month-1,day,hour,minute));
if(year<2000||year>2100||probe.getUTCFullYear()!==year||probe.getUTCMonth()!==month-1||probe.getUTCDate()!==day||hour>23||minute>59)throw new Error("Enter a valid calendar date from 2000 to 2100 and a valid time.");
return {year,month,day,hour,minute,stamp:probe.getTime()};
}
function partsAt(ms,zone){
if(!zones.includes(zone))throw new Error("Choose one of the supported time zones.");
const parts=new Intl.DateTimeFormat("en-GB",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(ms));
const map={};for(const p of parts)if(p.type!=="literal")map[p.type]=Number(p.value);
return map;
}
function resolve(date,time,zone){
const wanted=dateParts(date,time);if(!zones.includes(zone))throw new Error("Choose one of the supported time zones.");
const matches=[];
const fmt=new Intl.DateTimeFormat("en-GB",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
// Every supported zone's offsets in 2000–2100 fall on quarter-hour boundaries.
// Enumerate candidate instants to detect DST gaps and overlaps, never guessing an offset.
for(let minutes=-14*60;minutes<=14*60;minutes+=15){
const stamp=wanted.stamp+minutes*60000;const map={};
for(const p of fmt.formatToParts(new Date(stamp)))if(p.type!=="literal")map[p.type]=Number(p.value);
if(["year","month","day","hour","minute"].every(k=>map[k]===wanted[k]))matches.push(stamp);
}
if(matches.length===0)throw new Error("That local time does not exist because the clocks change. Choose another time.");
if(matches.length>1)throw new Error("That local time occurs twice when the clocks change. Choose UTC as the reference, or choose another time.");
return new Date(matches[0]).toISOString();
}
function display(iso,zone){return new Intl.DateTimeFormat("en-GB",{timeZone:zone,weekday:"short",day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZoneName:"shortOffset"}).format(new Date(iso));}
function summary(v,iso){return ["LOCAL DISCOVERY-SLOT PREVIEW — NOT A BOOKING","Name: "+(v.name.trim()||"Not provided"),"Email: "+(v.email.trim()||"Not provided"),"Phone: "+(v.phone.trim()||"Not provided"),"Service: "+v.service,"Reference: "+v.date+" "+v.time+" ["+v.sourceZone+"]","Exact instant: "+iso,...zones.slice(1).map(z=>z+": "+display(iso,z)),"","Synthetic project notes:",v.notes||"Not provided","", "Availability was not checked. Nothing has been sent or reserved."].join("\n");}
return {zones,dateParts,partsAt,resolve,display,summary};
});
