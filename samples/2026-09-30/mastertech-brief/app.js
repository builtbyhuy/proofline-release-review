"use strict";
(function (root) {
  const text = value => typeof value === "string" ? value : "";
  const clean = value => text(value).trim();
  const optional = value => clean(value) || null;
  function activeFields(config, input) {
    return config.fields.filter(f => !f.branch || f.branch === input.intent);
  }
  function validate(config, input) {
    const errors = [];
    if (config.branches.length && !config.branches.some(b => b.value === input.intent)) errors.push({id:"intent", message:"Choose an enquiry type."});
    for (const f of activeFields(config,input)) {
      const v = clean(input[f.id]);
      if (f.required && !v) errors.push({id:f.id,message:`Enter ${f.label.toLowerCase()}.`});
      else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.push({id:f.id,message:"Enter an email such as alex@example.com."});
      else if (v && f.type === "url") {
        try { const u = new URL(v); if (!["http:","https:"].includes(u.protocol)) throw new Error("scheme"); }
        catch { errors.push({id:f.id,message:"Use a complete http:// or https:// URL, or leave this optional field blank."}); }
      } else if (v && f.options && !f.options.some(o => o[0] === v)) errors.push({id:f.id,message:"Choose one of the displayed options."});
    }
    return errors;
  }
  function compose(config, input, origin="local draft — not a real submission") {
    const errors = validate(config,input);
    if (errors.length) return {errors};
    const meta = {independent_prototype:true, endorsed_or_deployed:false, destination_company:config.company, input_origin:origin, sources_observed:"2026-09-30", publication_date:null, source_urls:config.sources};
    let subject, lines, payload;
    if (config.kind === "splash") {
      const freelance = input.intent === "freelance";
      subject = `[${freelance ? "Freelance introduction" : "Project enquiry"}] ${clean(input.name).replace(/[\r\n]+/g," ")}`;
      const contact = {name:clean(input.name), phone:optional(input.phone), email:clean(input.email), website:optional(input.website)};
      const brief = freelance ? {portfolio:optional(input.portfolio), narrow_contribution:clean(input.skill), introduction:text(input.message)} : {requested_service:optional(input.service), goal:text(input.goal)};
      payload = {prototype:meta,intent:input.intent,subject,contact,brief};
      lines = [subject,`Name: ${contact.name}`,`Email: ${contact.email}`,`Phone: ${contact.phone || "Not supplied"}`,`Website: ${contact.website || "Not supplied"}`,"",...(freelance ? [`Portfolio: ${brief.portfolio || "Not supplied"}`,`Contribution: ${brief.narrow_contribution}`,"Introduction:",brief.introduction] : [`Requested service: ${brief.requested_service || "Not supplied"}`,"Goal:",brief.goal])];
    } else if (config.kind === "mother") {
      const category = config.branches.find(b => b.value === input.intent).label;
      subject = `[${category}] ${clean(input.subject).replace(/[\r\n]+/g," ")}`;
      const context = input.intent === "project" ? {project_context:optional(input.project_type)} : input.intent === "freelance" ? {portfolio:optional(input.portfolio), contribution:optional(input.discipline)} : {};
      payload = {prototype:meta,category:input.intent,subject,original_subject:text(input.subject),email:clean(input.email),message:text(input.message),context};
      lines = [subject,`From: ${payload.email}`,`Intent: ${category}`, ...Object.entries(context).map(([k,v]) => `${k.replaceAll("_"," ")}: ${v || "Not supplied"}`),"","Original message:",payload.message];
    } else {
      const field = config.fields.find(f => f.id === "interest");
      const interest = {value:clean(input.interest),label:field.options.find(o => o[0] === input.interest)[1]};
      subject = `[Project enquiry] ${interest.label} — ${clean(input.name).replace(/[\r\n]+/g," ")}`;
      const inquiry = {full_name:clean(input.name),email_address:clean(input.email),company_name:optional(input.company),interest,project_description:text(input.message)};
      const additions = {timeline:optional(input.timeline),budget:optional(input.budget)};
      const missing = [...(!inquiry.company_name ? ["company_name"] : []), ...Object.entries(additions).filter(([,v])=>v===null).map(([k])=>k)];
      payload = {schema_version:"1.0",prototype:meta,subject,inquiry,optional_prototype_fields:additions,missing_information:missing};
      lines = [subject,`Full name: ${inquiry.full_name}`,`Email: ${inquiry.email_address}`,`Company: ${inquiry.company_name || "Unknown — not supplied"}`,`Interest: ${interest.label}`,`Timeline: ${additions.timeline || "Unknown — not supplied"}`,`Budget: ${additions.budget || "Unknown — not supplied"}`,"Project description:",inquiry.project_description,"",`Missing information: ${missing.length ? missing.join(", ") : "None among these fields"}`];
    }
    const summary = ["INDEPENDENT PROTOTYPE / LOCAL PREVIEW",`Input origin: ${origin}`,"Not deployed, endorsed or sent. No business outcome is claimed.","",...lines].join("\n");
    return {errors:[],subject,summary,payload,json:JSON.stringify(payload,null,2)};
  }
  function mount(config, doc) {
    const form = doc.getElementById("composer");
    const status = doc.getElementById("status");
    const preview = doc.getElementById("preview");
    const json = doc.getElementById("json-output");
    const subject = doc.getElementById("subject-output");
    const copy = doc.getElementById("copy");
    const download = doc.getElementById("download");
    const errorSummary = doc.getElementById("error-summary");
    let result = null;
    let origin = "local draft — not a real submission";
    function values() { const v={}; for(const el of form.elements) if(el.name) v[el.name]=el.value; return v; }
    function clearErrors() {
      errorSummary.hidden=true; errorSummary.textContent="";
      for(const el of form.elements) { el.removeAttribute("aria-invalid"); const e=doc.getElementById(`${el.id}-error`); if(e) e.textContent=""; }
    }
    function invalidate(message) { result=null;copy.disabled=true;download.disabled=true;preview.value="";json.textContent="No export generated yet.";subject.textContent="Preview a draft to create its subject.";status.textContent=message; }
    function branch() {
      const intent=values().intent;
      for(const wrapper of doc.querySelectorAll("[data-branch]")) wrapper.hidden=wrapper.dataset.branch !== intent;
    }
    form.addEventListener("input",()=>{origin="edited local draft — use synthetic data only";clearErrors();invalidate("Draft changed. Preview again to refresh the export.");});
    form.addEventListener("change",()=>{branch();origin="edited local draft — use synthetic data only";clearErrors();invalidate("Enquiry type or option changed. Common fields are preserved.");});
    form.addEventListener("submit",event=>{
      event.preventDefault();clearErrors();result=compose(config,values(),origin);
      if(result.errors.length) {
        const errors=result.errors;invalidate("Please correct the highlighted fields. Nothing was sent.");
        errorSummary.hidden=false;errorSummary.textContent=`${errors.length} field${errors.length===1?"":"s"} need attention.`;
        for(const e of errors) { const el=doc.getElementById(e.id);if(el)el.setAttribute("aria-invalid","true");const note=doc.getElementById(`${e.id}-error`);if(note)note.textContent=e.message; }
        doc.getElementById(errors[0].id)?.focus();return;
      }
      preview.value=result.summary;json.textContent=result.json;subject.textContent=result.subject;copy.disabled=false;download.disabled=false;status.textContent="Local preview ready. Nothing has been sent or saved remotely.";
    });
    doc.getElementById("load-example").addEventListener("click",()=>{
      form.reset();for(const [key,value] of Object.entries(config.example)) if(form.elements.namedItem(key)) form.elements.namedItem(key).value=value;
      origin="synthetic example — fictional people and project";branch();clearErrors();invalidate("Synthetic example loaded. Preview to inspect it; edit or reset at any time.");
    });
    doc.getElementById("reset").addEventListener("click",()=>{form.reset();origin="local draft — not a real submission";branch();clearErrors();invalidate("Cleared all draft fields and output. Nothing was sent.");form.querySelector("input,select")?.focus();});
    copy.addEventListener("click",async()=>{
      if(!result || result.errors.length)return;
      try { if(!root.navigator?.clipboard?.writeText) throw new Error("clipboard unavailable");await root.navigator.clipboard.writeText(result.summary);status.textContent="Summary copied to your clipboard. It has not been sent."; }
      catch { preview.focus();preview.select();status.textContent="Automatic clipboard access is unavailable. The summary is selected; use Ctrl+C or Command+C."; }
    });
    download.addEventListener("click",()=>{
      if(!result || result.errors.length)return;
      const blob=new Blob([result.json+"\n"],{type:"application/json;charset=utf-8"});const url=URL.createObjectURL(blob);const a=doc.createElement("a");a.href=url;a.download=`${config.folder}-local-brief.json`;doc.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent="JSON export prepared locally. No enquiry was submitted.";
    });
    branch();invalidate("Start with synthetic example data, or compose a fictional draft.");
  }
  const api={validate,compose,activeFields,mount};
  if(typeof module!=="undefined" && module.exports)module.exports=api;
  if(root.document && root.SampleConfig) mount(root.SampleConfig,root.document);
})(typeof window!=="undefined" ? window : globalThis);
