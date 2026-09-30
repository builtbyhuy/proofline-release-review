(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.FormQA=api;})(globalThis,function(){
"use strict";
function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());}
function validate(values){
const errors={};
if(!validEmail(values.email))errors.email="Enter an email address such as alex@example.test.";
if(!validEmail(values.confirmEmail))errors.confirmEmail="Confirm your email address.";
if(validEmail(values.email)&&validEmail(values.confirmEmail)&&values.email.trim()!==values.confirmEmail.trim()){
errors.email="The two email addresses do not match.";errors.confirmEmail="Use the same address in both email fields.";
}
if(!String(values.enquiry||"").trim())errors.enquiry="Add a short enquiry so the recipient has context.";
if(values.consent!==true)errors.consent="Check the demonstration consent box to continue.";
return errors;
}
function attempt(values,fail){const errors=validate(values);return {values:{...values},errors,state:Object.keys(errors).length?"invalid":fail?"simulated-error":"preview-ready"};}
function summary(v){return ["LOCAL DEMONSTRATION — NOTHING SENT","Name: "+(v.name.trim()||"Not provided"),"Email: "+v.email.trim(),"Phone: "+(v.phone.trim()||"Not provided"),"Demonstration consent: "+(v.consent?"Checked":"Not checked"),"","Enquiry:",v.enquiry].join("\n");}
return {validEmail,validate,attempt,summary};
});
