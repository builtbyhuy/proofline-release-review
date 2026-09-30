AGENCY LMC — INDEPENDENT 180-CHARACTER BRIEF COMPOSER
Built and checked: 30 September 2026
Status: working local prototype; not commissioned, endorsed or connected to LMC.

OPEN
Open index.html in a modern browser. Keep style.css, logic.js and app.js beside
it. No installation, dependencies, API, network service or external assets.

TRY IT
1. Load the synthetic brief.
2. Edit only the short opening. The longer brief remains unchanged.
3. Add enough text to exceed 180: overflow is shown and Copy short message
   becomes unavailable. The text is retained rather than silently truncated.
4. Bring the short message within budget and copy it explicitly.
5. Download complete brief to retain both versions and contact fields locally.
6. Reloading/closing the page clears data that was not copied or downloaded.

COUNTING RULE
This demo uses JavaScript UTF-16 code-unit length, the standard length model
underlying HTML textarea maxlength. Most ordinary letters count as one; some
emoji and combining sequences count as two or more. The UI explains this.
LMC's live counter algorithm and hard-limit behaviour were not inspected.
The sample does not claim to reproduce their implementation exactly.
179, 180 and 181 ASCII-character boundaries are tested, as are emoji and
combining-text cases. There is no automatic AI compression or truncation.

EVIDENCE
https://agencylmc.com/connect/
Accessed 2026-09-30. Publication date unknown.
The public page shows Name, Email, Company, Phone and the exact text
"Message 0 / 180". See findings.txt for the evidence boundary.

TEST
From this directory: node test.cjs
Tests cover 179/180/181 boundaries, Unicode counting, empty/whitespace handling,
independent full-brief retention and plain-text exports with literal markup.

DATA AND SCOPE
No form submission, clipboard action or download occurs automatically.
Copy/download require a user click. Nothing is sent to LMC. No analytics,
storage, fetch or XHR. Content Security Policy blocks connections and form
actions. Entries live in page memory; explicit downloads are plain text.
This is a drafting aid, not a booking, contract, client lead or production patch.

