"use strict";
const config = {
  "folder": "splashsol-intake",
  "company": "SplashSol",
  "kind": "splash",
  "eyebrow": "TWO-PATH INTAKE",
  "title": "One entry point. Two clear briefs.",
  "description": "Choose a project enquiry or freelance introduction, then create a labelled local summary.",
  "accent": "#135cba",
  "sources": [
    "https://splashsol.com/contact-us/",
    "https://splashsol.com/careers/"
  ],
  "observation": "The published careers application links to the project-contact route. Name, phone, email and optional website fields are retained here; branch-specific fields are additions in this prototype.",
  "source_refs": [
    "turn943view0",
    "turn933view1",
    "turn934view5"
  ],
  "branches": [
    {
      "value": "project",
      "label": "Project enquiry"
    },
    {
      "value": "freelance",
      "label": "Freelance introduction"
    }
  ],
  "fields": [
    {
      "id": "name",
      "label": "Name",
      "required": true
    },
    {
      "id": "phone",
      "label": "Phone",
      "type": "tel",
      "hint": "Optional in this prototype."
    },
    {
      "id": "email",
      "label": "Email",
      "type": "email",
      "required": true
    },
    {
      "id": "website",
      "label": "Website URL",
      "type": "url",
      "hint": "Optional. Use an https:// or http:// address."
    },
    {
      "id": "service",
      "label": "Requested service",
      "branch": "project",
      "hint": "Your description, not an official service selector."
    },
    {
      "id": "goal",
      "label": "What would you like to achieve?",
      "type": "textarea",
      "branch": "project",
      "required": true
    },
    {
      "id": "portfolio",
      "label": "Portfolio URL",
      "type": "url",
      "branch": "freelance",
      "hint": "Optional link to relevant work; do not invent client results."
    },
    {
      "id": "skill",
      "label": "Narrow contribution",
      "branch": "freelance",
      "options": [
        [
          "",
          "Choose one"
        ],
        [
          "Responsive HTML/CSS",
          "Responsive HTML/CSS"
        ],
        [
          "UI-state correction",
          "UI-state correction"
        ],
        [
          "Other reviewed task",
          "Other reviewed task"
        ]
      ],
      "required": true
    },
    {
      "id": "message",
      "label": "Short introduction and scope",
      "type": "textarea",
      "branch": "freelance",
      "required": true
    }
  ],
  "example": {
    "intent": "project",
    "name": "Alex Example",
    "phone": "",
    "email": "alex@example.com",
    "website": "",
    "service": "One responsive landing-page section",
    "goal": "Synthetic project: build one supplied-design section and check it at 390px and desktop widths.",
    "portfolio": "https://example.com/portfolio",
    "skill": "Responsive HTML/CSS",
    "message": "Synthetic applicant: entry-level, with an independent practice sample and AI-assisted implementation. Seeking one reviewed component."
  }
};
if(typeof module!=="undefined" && module.exports)module.exports=config;
if(typeof window!=="undefined")window.SampleConfig=config;
