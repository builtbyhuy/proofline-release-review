const assert=require("node:assert/strict");const b=require("./logic.js");
for(const n of [179,180,181]){const s=b.inspect("x".repeat(n));assert.equal(s.length,n);assert.equal(s.remaining,180-n);assert.equal(s.canCopy,n<=180);assert.equal(s.overflow,Math.max(0,n-180));}
assert.equal(b.count("🙂"),2);assert.equal(b.count("e\u0301"),2);assert.equal(b.count("Tiếng Việt"),10);
assert.equal(b.inspect("").canCopy,false);assert.equal(b.inspect("   ").canCopy,false);
const original={name:"Alex",email:"alex@example.test",company:"Synthetic",phone:"",short:"Old opening",full:"Full brief\n<script>literal text</script>"};
const updated=b.replaceShort(original,"New opening");
assert.equal(updated.full,original.full);assert.equal(original.short,"Old opening");
const output=b.exportText(updated);assert.match(output,/New opening/);assert.match(output,/Full brief\n<script>literal text<\/script>/);assert.match(output,/NOTHING SENT/);
assert.equal(b.inspect("🙂".repeat(90)).length,180);assert.equal(b.inspect("🙂".repeat(91)).canCopy,false);
console.log("LMC: boundary, Unicode counting, preservation and literal export checks passed.");

