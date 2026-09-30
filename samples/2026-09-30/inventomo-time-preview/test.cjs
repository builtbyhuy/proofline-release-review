const assert=require("node:assert/strict");const p=require("./logic.js");
assert.equal(p.resolve("2026-10-15","14:00","UTC"),"2026-10-15T14:00:00.000Z");
assert.equal(p.resolve("2026-10-15","19:00","Asia/Karachi"),"2026-10-15T14:00:00.000Z");
assert.equal(p.resolve("2026-10-15","21:00","Asia/Ho_Chi_Minh"),"2026-10-15T14:00:00.000Z");
assert.equal(p.resolve("2026-07-15","10:00","America/New_York"),"2026-07-15T14:00:00.000Z");
assert.equal(p.resolve("2026-12-15","09:00","America/New_York"),"2026-12-15T14:00:00.000Z");
assert.throws(()=>p.resolve("2026-03-08","02:30","America/New_York"),/does not exist/);
assert.throws(()=>p.resolve("2026-11-01","01:30","America/New_York"),/occurs twice/);
assert.throws(()=>p.resolve("2026-02-30","14:00","UTC"),/valid calendar/);
assert.throws(()=>p.resolve("","14:00","UTC"),/complete date/);
assert.throws(()=>p.resolve("2026-10-15","","UTC"),/complete date/);
assert.throws(()=>p.resolve("2026-10-15","14:00","Invalid\/Zone"),/supported/);
const day=p.partsAt(Date.parse("2026-10-15T22:00:00Z"),"Asia/Ho_Chi_Minh");assert.equal(day.day,16);assert.equal(day.hour,5);
const v={name:"Alex",email:"alex@example.test",phone:"",service:"UI/UX Design",date:"2026-10-15",time:"14:00",sourceZone:"UTC",notes:"Keep <b>literal</b> notes."};
const summary=p.summary(v,"2026-10-15T14:00:00Z");assert.match(summary,/UI\/UX Design/);assert.match(summary,/Keep <b>literal<\/b> notes\./);assert.match(summary,/NOT A BOOKING/);
console.log("Inventomo: exact-instant, three-zone, DST gap/overlap, rollover, validation and summary checks passed.");

