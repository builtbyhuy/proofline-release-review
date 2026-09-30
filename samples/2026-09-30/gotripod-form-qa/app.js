"use strict";
const $=id=>document.getElementById(id);
const fieldNames=["name","email","confirmEmail","phone","enquiry"];
function read(){const v={};fieldNames.forEach(k=>v[k]=$(k).value);v.consent=$("consent").checked;return v;}
function clearErrors(){["email","confirmEmail","enquiry","consent"].forEach(k=>{$(k).removeAttribute("aria-invalid");$(k+"-error").textContent="";});}
function run(fail){
clearErrors();const result=FormQA.attempt(read(),fail);const keys=Object.keys(result.errors);
$("status").className="status"+(result.state!=="preview-ready"?" bad":"");
$("preview").value="";$("copy").disabled=true;$("copy-status").textContent="";
if(keys.length){keys.forEach(k=>{$(k).setAttribute("aria-invalid","true");$(k+"-error").textContent=result.errors[k];});$("status").textContent="Please correct "+keys.length+" highlighted field"+(keys.length===1?"":"s")+". Nothing was sent.";$(keys[0]).focus();return;}
if(fail){$("status").textContent="Simulated connection failure — no request was attempted. Every entry is still here. Choose Validate & preview to retry locally.";return;}
$("status").textContent="Validation passed. Local preview ready; nothing was sent."; $("preview").value=FormQA.summary(result.values);$("copy").disabled=false;
}
$("demo-form").addEventListener("submit",e=>{e.preventDefault();run(false);});
$("fail").addEventListener("click",()=>run(true));
$("load").addEventListener("click",()=>{const fixture={name:"Alex Example",email:"alex@example.test",confirmEmail:"alex@example.test",phone:"",enquiry:"Synthetic brief: improve a mobile navigation menu and add a keyboard-friendly enquiry flow."};fieldNames.forEach(k=>$(k).value=fixture[k]);$("consent").checked=true;clearErrors();$("status").className="status";$("status").textContent="Synthetic example loaded. Validate or simulate a failure.";$("preview").value="";$("copy").disabled=true;$("copy-status").textContent="";});
$("demo-form").addEventListener("input",()=>{$("preview").value="";$("copy").disabled=true;$("copy-status").textContent="";$("status").textContent="Edited locally. Validate again to refresh the preview.";$("status").className="status";});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("preview").value);$("copy-status").textContent="Copied to your clipboard by your request.";}catch{$("preview").focus();$("preview").select();$("copy-status").textContent="Automatic copying is unavailable here. The preview is selected; use Ctrl/Cmd+C.";}});

