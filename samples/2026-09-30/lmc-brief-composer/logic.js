(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.BriefComposer=api;})(globalThis,function(){
"use strict";const limit=180;
function count(text){return String(text).length;}
function inspect(text){const length=count(text);return {length,remaining:limit-length,overflow:Math.max(0,length-limit),canCopy:length>0&&length<=limit&&String(text).trim().length>0};}
function replaceShort(draft,short){return {...draft,short};}
function exportText(v){return ["LOCAL BRIEF — NOTHING SENT TO AGENCY LMC","Synthetic/local contact details","Name: "+(v.name||"Not provided"),"Email: "+(v.email||"Not provided"),"Company: "+(v.company||"Not provided"),"Phone: "+(v.phone||"Not provided"),"","SHORT OPENING ("+count(v.short)+"/180 UTF-16 code units)",v.short||"Not provided","","FULL BRIEF — RETAINED INDEPENDENTLY",v.full||"Not provided","","No availability, contract or price is implied. This file was generated locally at the user's request."].join("\n");}
return {limit,count,inspect,replaceShort,exportText};
});
