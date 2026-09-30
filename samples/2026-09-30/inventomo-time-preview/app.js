"use strict";const $=id=>document.getElementById(id);
let currentIso=null;
const labels={"Asia/Karachi":"Pakistan","America/New_York":"New York","Asia/Ho_Chi_Minh":"Vietnam"};
function values(){const v={};["name","email","phone","service","date","time","sourceZone","notes"].forEach(k=>v[k]=$(k).value);return v;}
function invalidate(){currentIso=null;$("preview").value="";$("copy").disabled=true;$("zone-cards").replaceChildren();$("instant").textContent="";$("copy-status").textContent="";}
function renderCards(){if(!currentIso)return;$("zone-cards").replaceChildren();for(const zone of TimePreview.zones.slice(1)){const card=document.createElement("div");card.className="mini"+($("viewerZone").value===zone?" zone-selected":"");const name=document.createElement("span");name.textContent=labels[zone]+" · "+zone;const time=document.createElement("strong");time.textContent=TimePreview.display(currentIso,zone);card.append(name,time);$("zone-cards").append(card);}}
function preview(){
invalidate();$("slot-error").textContent="";$("date").removeAttribute("aria-invalid");$("time").removeAttribute("aria-invalid");const v=values();
try{currentIso=TimePreview.resolve(v.date,v.time,v.sourceZone);renderCards();$("instant").textContent="Exact UTC instant: "+currentIso;$("preview").value=TimePreview.summary(v,currentIso);$("copy").disabled=false;$("status").className="status";$("status").textContent="Local preview ready. No availability was checked and no meeting was booked.";}
catch(error){$("slot-error").textContent=error.message;$("status").className="status bad";$("status").textContent="No preview produced. Your contact details and notes remain unchanged.";const target=v.date?$("time"):$("date");target.setAttribute("aria-invalid","true");target.focus();}
}
$("slot-form").addEventListener("submit",e=>{e.preventDefault();preview();});
$("slot-form").addEventListener("input",()=>{invalidate();$("status").className="status";$("status").textContent="Edited locally. Preview again to update the times and summary.";$("slot-error").textContent="";});
$("viewerZone").addEventListener("change",renderCards);
$("reset").addEventListener("click",()=>{$("slot-form").reset();$("sourceZone").value="UTC";$("date").value="2026-10-15";$("time").value="14:00";preview();});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("preview").value);$("copy-status").textContent="Copied by your request. Share manually only if you choose.";}catch{$("preview").focus();$("preview").select();$("copy-status").textContent="Automatic copy unavailable. The summary is selected; use Ctrl/Cmd+C.";}});
preview();

