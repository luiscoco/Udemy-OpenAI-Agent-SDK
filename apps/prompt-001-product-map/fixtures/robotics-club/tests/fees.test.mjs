import assert from "node:assert/strict";
import test from "node:test";
import { membershipFee } from "../src/fees.mjs";

test("standard fee", () => assert.equal(membershipFee(), 40));
test("sibling discount", () =>
  assert.equal(membershipFee({ siblings: 2 }), 30));
