import test from "node:test";
import assert from "node:assert/strict";

import { DURATION, EASE, HOVER, enter, hover } from "./motion.ts";

test("enter() steps the delay so a list arrives in order, not all at once", () => {
  assert.equal(enter(0).delay, 0);
  assert.equal(enter(3).delay, enter(0).delay + 3 * 0.055);
  assert.ok(enter(2).delay > enter(1).delay);
});

test("enter() clamps the delay, so a long list still finishes with the page", () => {
  assert.equal(enter(40).delay, enter(8).delay);
  assert.equal(enter(-5).delay, 0);
});

test("every step shares one duration and one curve", () => {
  for (const index of [0, 1, 5, 8]) {
    assert.equal(enter(index).duration, DURATION);
    assert.deepEqual(enter(index).ease, EASE);
  }
});

test("hover() returns undefined under reduced motion, which is what disables it", () => {
  assert.equal(hover(true), undefined);
  assert.deepEqual(hover(false), HOVER);
  assert.notEqual(hover(false), undefined);
});
