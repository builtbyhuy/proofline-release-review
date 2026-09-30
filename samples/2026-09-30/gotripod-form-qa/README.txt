GO TRIPOD — INDEPENDENT ENQUIRY FORM QA SAMPLE
Built and checked: 30 September 2026
Status: working local prototype; not deployed, commissioned or endorsed.

OPEN
Open index.html in a modern browser. No installation or network service is needed.
Keep index.html, style.css, logic.js and app.js together. These four files are also
ready to serve as a static directory. There are no APIs, packages, fonts, trackers
or external runtime assets.

TRY IT
1. Load the synthetic example, then Validate & preview.
2. Change Confirm email. Both email controls identify the mismatch; focus goes
   to the first failing control. Correct it.
3. Uncheck the demonstration consent checkbox and validate.
4. Restore valid values and choose Simulate connection failure.
5. Check that all values remain, then Validate & preview for a local retry.
6. Copy preview explicitly. If clipboard permission is unavailable, the preview
   is selected and the page explains manual copying.

WHAT WAS BUILT
Pure validation and state-transition functions in logic.js; accessible field
errors and first-error focus in app.js; a simulated failure that never issues a
request; safe text previews. Name and phone stay optional. Email comparison is
exact after trimming, intentionally documented rather than silently lowercasing
the local part of an address.

EVIDENCE
https://gotripod.com/contact
Accessed 2026-09-30. Original publication date unknown. The public page shows
Name, Email/Confirm Email, Phone, required Enquiry and privacy consent.
No live submission or production validation was tested. See findings.txt.

TEST
From this directory run: node test.cjs
Tests cover valid/mismatched emails, missing consent/enquiry, malformed email,
whitespace normalization, preservation after failure, retry and literal text.
No dependencies are needed for these tests.

DATA AND SCOPE
No fetch, XHR, analytics, storage or form endpoint. A restrictive Content Security
Policy prohibits connections and form actions. Entries are held only in page
memory. Explicit copying puts data in the user's clipboard. Closing the page
clears the draft. Use synthetic details. This is not an email-deliverability,
backend, security, legal-consent or production-readiness guarantee.

