"use strict";
const config = {
  "folder": "mastertech-brief",
  "company": "Master Technology Labs",
  "kind": "master",
  "eyebrow": "ENQUIRY → LOCAL BRIEF",
  "title": "A readable brief. No invented details.",
  "description": "Turn the published enquiry fields into a text summary and inspectable JSON. Missing company, timing and budget remain explicit.",
  "accent": "#326a46",
  "sources": [
    "https://www.mastertechlabs.com/contact",
    "https://www.mastertechlabs.com/careers"
  ],
  "observation": "Full Name, Email Address, Company Name, interest selector and project text come from the public contact form. Selector labels were read from public HTML. Optional timeline and budget fields are prototype additions, not claimed live fields.",
  "source_refs": [
    "turn943view2",
    "turn934view1",
    "turn936view2"
  ],
  "branches": [],
  "fields": [
    {
      "id": "name",
      "label": "Full Name",
      "required": true
    },
    {
      "id": "email",
      "label": "Email Address",
      "type": "email",
      "required": true
    },
    {
      "id": "company",
      "label": "Company Name",
      "hint": "Optional in this prototype. Blank exports as null."
    },
    {
      "id": "interest",
      "label": "What are you interested in?",
      "required": true,
      "options": [
        [
          "",
          "Select a service"
        ],
        [
          "ai",
          "Custom AI Solutions"
        ],
        [
          "web",
          "Website Design & Development"
        ],
        [
          "marketing",
          "Digital Marketing & Paid Ads"
        ],
        [
          "product",
          "Product Development"
        ],
        [
          "automation",
          "Workflow Automation"
        ],
        [
          "other",
          "Something else"
        ]
      ]
    },
    {
      "id": "message",
      "label": "Tell us about your project",
      "type": "textarea",
      "required": true
    },
    {
      "id": "timeline",
      "label": "Timeline — optional prototype field",
      "hint": "Leave blank if unknown. No schedule is inferred."
    },
    {
      "id": "budget",
      "label": "Budget — optional prototype field",
      "hint": "Describe a stated amount/currency or leave unknown."
    }
  ],
  "example": {
    "name": "Taylor Example",
    "email": "taylor@example.com",
    "company": "",
    "interest": "automation",
    "message": "Synthetic enquiry: turn a sample intake record into a reviewable brief. No live CRM access or production data is included.",
    "timeline": "",
    "budget": ""
  }
};
if(typeof module!=="undefined" && module.exports)module.exports=config;
if(typeof window!=="undefined")window.SampleConfig=config;
