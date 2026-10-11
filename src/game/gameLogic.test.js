import test from "node:test";
import assert from "node:assert/strict";
import { createInitialGameState, gameReducer } from "./gameLogic.js";
import { createInitialExperienceState, experienceReducer } from "../app/experienceReducer.js";
import { loveMessages } from "../data/loveMessages.js";
import { memories } from "../data/memories.js";
import { siteConfig } from "../data/siteConfig.js";

function begin(requiredHearts) {
  return gameReducer(createInitialGameState(requiredHearts), { type: "START" });
}

test("starts ready, then exposes four hearts with unique IDs", () => {
  assert.equal(createInitialGameState().status, "ready");
  const active = begin();
  assert.equal(active.status, "playing");
  assert.equal(active.collectibles.filter((item) => item.type === "heart").length, 4);
  assert.equal(new Set(active.collectibles.map((item) => item.id)).size, active.collectibles.length);
});

test("collecting a heart increments once; repeating its ID is ignored", () => {
  const active = begin();
  const id = active.collectibles.find((item) => item.type === "heart").id;
  const first = gameReducer(active, { type: "COLLECT", id });
  const second = gameReducer(first, { type: "COLLECT", id });
  assert.equal(first.count, 1);
  assert.equal(second.count, 1);
  assert.equal(first.collectibles.some((item) => item.id === id), false);
});

test("victory is exact and any subsequent collection is ignored", () => {
  let state = begin(siteConfig.requiredHearts);
  while (state.status === "playing") {
    const heart = state.collectibles.find((item) => item.type === "heart");
    assert.ok(heart, "an active game should retain a collectible heart");
    state = gameReducer(state, { type: "COLLECT", id: heart.id });
  }
  assert.equal(state.status, "won");
  assert.equal(state.count, 7);
  assert.equal(gameReducer(state, { type: "COLLECT", id: "heart-999" }), state);
});

test("bonus ladybug does not affect heart score", () => {
  const active = begin();
  const bug = active.collectibles.find((item) => item.type === "ladybug");
  const next = gameReducer(active, { type: "COLLECT", id: bug.id });
  assert.equal(next.count, 0);
  assert.equal(next.bonusCount, 1);
  assert.equal(next.collectibles.some((item) => item.id === bug.id), false);
});

test("restart resets the game but preserves configured target", () => {
  const active = begin(5);
  const scored = gameReducer(active, { type: "COLLECT", id: "heart-1" });
  const reset = gameReducer(scored, { type: "RESTART" });
  assert.equal(reset.status, "ready");
  assert.equal(reset.count, 0);
  assert.equal(reset.requiredHearts, 5);
  assert.deepEqual(reset.collectibles, []);
});

test("message and dream collection has 35 unique cards", () => {
  assert.equal(loveMessages.length, 30);
  assert.equal(memories.length, 5);
  const all = [...loveMessages, ...memories];
  assert.equal(all.length, 35);
  assert.equal(new Set(all.map((message) => message.id)).size, 35);
  assert.ok(memories.every((item) => item.category === "memories" && /I'd|Let's|One day|I hope/i.test(item.text)));
  assert.ok(loveMessages.some((message) => message.unlock === "game"));
});

test("birthday copy is fully personalized, with no blank names", () => {
  assert.equal(siteConfig.recipientName, "Malika");
  assert.equal(siteConfig.senderName, "Zack");
  assert.equal(siteConfig.birthdayDate, "12 October");
  assert.ok(siteConfig.birthdayLetter.length >= 4);
  assert.ok(siteConfig.birthdayLetter.every((paragraph) => paragraph.length > 40));
});

test("restarting the mini-game does not clear discovered notes", () => {
  let state = createInitialExperienceState(7);
  state = experienceReducer(state, { type: "OPEN_NOTE", id: "reason-01" });
  state = experienceReducer(state, { type: "GAME_ACTION", action: { type: "START" } });
  state = experienceReducer(state, { type: "GAME_ACTION", action: { type: "COLLECT", id: "heart-1" } });
  state = experienceReducer(state, { type: "GAME_ACTION", action: { type: "RESTART" } });
  assert.equal(state.game.count, 0);
  assert.deepEqual(state.discoveredMessageIds, ["reason-01"]);
});
