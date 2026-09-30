INVENTOMO — INDEPENDENT DISCOVERY-SLOT TIME-ZONE PREVIEW
Built and checked: 30 September 2026
Status: working local prototype; not commissioned, endorsed or a live calendar.

OPEN
Open index.html in a modern browser. Keep style.css, logic.js and app.js beside
it. No dependencies, build, API key or network service are needed. The four files
can also be served as a static directory.

TRY IT
The initial synthetic UTC slot is 2026-10-15 14:00. Preview it in Asia/Karachi,
America/New_York and Asia/Ho_Chi_Minh. Choose a reference zone before interpreting
the date/time inputs. Change the emphasized viewer zone to highlight one card.
Edit a service or note, preview again, and copy the summary explicitly.

EDGE CASES
New York 2026-03-08 02:30 is nonexistent during the forward clock change.
New York 2026-11-01 01:30 is ambiguous during the backward clock change.
Both are rejected with explanatory feedback rather than guessed.
Use an explicit UTC time or a different local time to resolve ambiguity.
The example slots are invented test inputs, not Inventomo's available times.

WHAT WAS BUILT
Intl.DateTimeFormat-based conversion for four explicitly supported IANA zones:
UTC, Asia/Karachi, America/New_York, Asia/Ho_Chi_Minh.
Dates are supported from 2000 through 2100. The resolver enumerates quarter-hour
offset candidates; those cover the supported zones in that interval, and detect
zero/multiple matching instants. It is deliberately not a general scheduling
engine. Runtime time-zone database changes can affect future dates.

EVIDENCE
https://inventomo.com/contact
Accessed 2026-09-30; source publication date unknown.
The discovery interface shows name, email, phone, service, date, time slot and
notes. Name/email/service are required on the live interface; they are optional
for this isolated time preview. Its actual slot options, availability, time-zone
rules and backend were not tested. Source details are in findings.txt.

TEST
From this directory: node test.cjs
Tests cover exact known instants in all three regions, summer/winter New York
offsets, DST gaps/overlaps, date rollover, invalid dates/zones and summary content.

DATA AND LIMITS
No calendar is queried, no slot reserved and no message sent. The page has no
network calls, tracking, storage or form endpoint. A Content Security Policy
blocks connections and form actions. The contact values and notes stay in page
memory until an explicit copy action; closing the page clears them. Use synthetic
data. No scheduling defect, operational savings or lost sales are alleged.

