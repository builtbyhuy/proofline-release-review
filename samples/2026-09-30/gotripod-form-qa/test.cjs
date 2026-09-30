const assert=require("node:assert/strict");const qa=require("./logic.js");
const base={name:"Alex",email:"alex@example.test",confirmEmail:"alex@example.test",phone:"",enquiry:"A synthetic brief.",consent:true};
assert.deepEqual(qa.validate(base),{});
assert.equal(qa.attempt(base,false).state,"preview-ready");
assert.equal(qa.attempt({...base,confirmEmail:"different@example.test"},false).state,"invalid");
assert.deepEqual(Object.keys(qa.validate({...base,confirmEmail:"different@example.test"})),["email","confirmEmail"]);
assert.ok(qa.validate({...base,consent:false}).consent);
assert.ok(qa.validate({...base,enquiry:"   "}).enquiry);
assert.ok(qa.validate({...base,email:"bad"}).email);
const before=JSON.stringify(base);const failed=qa.attempt(base,true);
assert.equal(failed.state,"simulated-error");assert.deepEqual(failed.values,base);assert.equal(JSON.stringify(base),before);
assert.equal(qa.attempt(failed.values,false).state,"preview-ready");
assert.match(qa.summary({...base,enquiry:"<script>synthetic</script>"}),/<script>synthetic<\/script>/);
assert.deepEqual(qa.validate({...base,email:" alex@example.test ",confirmEmail:"alex@example.test"}),{});
console.log("GoTripod: validation, preservation, retry and literal-text checks passed.");

