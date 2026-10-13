import test from "node:test";
import assert from "node:assert/strict";
import { reasonsBook } from "./reasonsBook.js";

test("the little book contains 100 distinct, finished reasons", () => {
  assert.equal(reasonsBook.length, 100);
  assert.equal(new Set(reasonsBook).size, 100, "every page should have distinct wording");
  for (const [index, reason] of reasonsBook.entries()) {
    assert.equal(typeof reason, "string", "reason " + (index + 1) + " should be text");
    assert.ok(reason.trim().length >= 24, "reason " + (index + 1) + " should be fully written");
    assert.equal(reason, reason.trim(), "reason " + (index + 1) + " should not have extra surrounding whitespace");
  }
});
