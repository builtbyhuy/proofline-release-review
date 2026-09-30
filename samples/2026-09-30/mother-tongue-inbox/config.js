"use strict";
const config = {
  "folder": "mother-tongue-inbox",
  "company": "Mother Tongue Design",
  "kind": "mother",
  "eyebrow": "STUDIO NOTE COMPOSER",
  "title": "Give every introduction a clear subject.",
  "description": "Create a project note, freelance introduction or other enquiry without changing the original message.",
  "accent": "#834337",
  "sources": [
    "https://www.mothertonguedesign.com/contact",
    "https://www.mothertonguedesign.com/careers"
  ],
  "observation": "The public contact page uses Email, Subject and Message. The creative-network invitation and contact page publish the same work@ address. Category prefixes and optional context are prototype additions.",
  "source_refs": [
    "turn943view1",
    "turn934view0",
    "turn936view1"
  ],
  "branches": [
    {
      "value": "project",
      "label": "Project enquiry"
    },
    {
      "value": "freelance",
      "label": "Freelance introduction"
    },
    {
      "value": "other",
      "label": "Other enquiry"
    }
  ],
  "fields": [
    {
      "id": "email",
      "label": "Email",
      "type": "email",
      "required": true
    },
    {
      "id": "subject",
      "label": "Subject",
      "required": true
    },
    {
      "id": "message",
      "label": "Message",
      "type": "textarea",
      "required": true,
      "hint": "Your original message is preserved. No AI classification or rewriting."
    },
    {
      "id": "project_type",
      "label": "Project context",
      "branch": "project",
      "hint": "Optional, such as one website component."
    },
    {
      "id": "portfolio",
      "label": "Portfolio URL",
      "type": "url",
      "branch": "freelance",
      "hint": "Optional. Use a public http:// or https:// URL."
    },
    {
      "id": "discipline",
      "label": "Contribution / discipline",
      "branch": "freelance",
      "hint": "Optional; describe only what your examples demonstrate."
    }
  ],
  "example": {
    "intent": "project",
    "email": "sam@example.com",
    "subject": "Small website component",
    "message": "Synthetic example: we have an approved layout and need one responsive section. Please review the scope before suggesting a schedule.",
    "project_type": "Website implementation",
    "portfolio": "https://example.com/work",
    "discipline": "Entry-level HTML/CSS implementation"
  }
};
if(typeof module!=="undefined" && module.exports)module.exports=config;
if(typeof window!=="undefined")window.SampleConfig=config;
