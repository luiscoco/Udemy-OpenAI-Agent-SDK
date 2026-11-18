import test from "node:test";
import assert from "node:assert/strict";
import { lookupActivity } from "../tools/club.mjs";

test("robotics has a complete timetable entry", () => {
  assert.deepEqual(lookupActivity("robotics"), {
    activity: "Robotics",
    day: "Tuesday",
    time: "16:00",
    room: "Lab 2",
  });
});

test("unknown activities fail explicitly", () => {
  assert.throws(() => lookupActivity("unknown"), /Choose robotics/);
});
