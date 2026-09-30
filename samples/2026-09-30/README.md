# Small tools, clear handoffs

Eight independent, AI-assisted work samples by Hồ Khắc Huy, prepared on 30 September 2026. These are original prototypes, not commissioned client work, endorsements or evidence of paid outcomes.

Each sample starts with a dated public observation. Source facts and synthetic test cases are identified separately. Public business pages were generally undated; the observation date is not their publication date. No private customer records, analytics or inboxes were inspected.

## Open a sample

Open `index.html` for the directory, or open a sample's own `index.html`. All runtime assets are local. No account, API key, installation or purchase is required. Optional exports are created in the browser; nothing is sent to a company.

| Folder | Reviewable behavior | Evidence boundary |
| --- | --- | --- |
| `vhp-catalog-check` | Normalize codes, preserve raw records, flag same-code/different-name groups, export review CSV | Two real public product records; no conclusion about which code is correct |
| `gotripod-form-qa` | Matching-email validation and retained input after a simulated failure | Synthetic tests around published fields; no demonstrated live form fault |
| `splashsol-intake` | Separate project and freelance summaries | A proposed branch for a shared public contact route |
| `inventomo-time-preview` | Compare one example meeting instant across time zones | Synthetic availability; no calendar connection or actual booking |
| `mother-tongue-inbox` | Label project/freelance/other briefs | A proposed aid for published shared contact channels; existing routing unknown |
| `mastertech-brief` | Export enquiry details as text/JSON with explicit unknowns | Public fields; no real CRM connection |
| `facility-link-review` | Review six published destinations and deliberately injected practice faults | No assertion that live links are broken or inaccessible |
| `lmc-brief-composer` | Retain a full brief while editing a 180-character opening | Published counter; demo counting rule is explicit and live enforcement untested |

## Verify

Use Node.js 20 or later:

```sh
node run-tests.cjs
```

The runner invokes eight dependency-free logic suites. Per-sample README and test files describe their coverage. Logic checks do not establish browser appearance, actual downloads, clipboard permissions or production behavior. Browser checks and any limitations are recorded separately; do not turn an unrun check into a pass.

## Use and limitations

Use synthetic data while evaluating the demos. The tools do not save inputs after a reload. They do not connect to a company's site or automate outbound messages. Catalogue flags require a parts specialist; link flags require destination-owner confirmation. No sample measures revenue loss, traffic, conversion improvement or cash savings.

Any later estimate must use a confirmed count of relevant events, measured before/after handling time, and the owner's own cost input. Include implementation/review overhead. Saved staff capacity is distinct from cash recovered.

The repository's code license applies to the original sample code. Company names, short factual product labels and source URLs identify the observations; they do not imply permission to use company branding or a business relationship.
