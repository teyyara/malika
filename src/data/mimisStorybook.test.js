import test from "node:test";
import assert from "node:assert/strict";
import { storybookChapters, composeMimisStorybookText } from "./mimisStorybook.js";

test("Mimi's storybook has three complete chapters with distinct choices", () => {
  assert.equal(storybookChapters.length, 3);
  const chapterIds = storybookChapters.map((chapter) => chapter.id);
  assert.equal(new Set(chapterIds).size, chapterIds.length);
  for (const [index, chapter] of storybookChapters.entries()) {
    assert.ok(chapter.title.trim().length > 0, "chapter " + (index + 1) + " needs a title");
    assert.ok(chapter.question.trim().length > 0, "chapter " + (index + 1) + " needs its story prompt");
    assert.equal(chapter.choices.length, 3, "chapter " + (index + 1) + " should offer three choices");
    const ids = chapter.choices.map((choice) => choice.id);
    assert.equal(new Set(ids).size, ids.length, "choice ids should be distinct within each chapter");
    for (const choice of chapter.choices) {
      assert.ok(choice.label.trim().length > 0);
      assert.ok(choice.detail.trim().length > 0);
      assert.ok(choice.passage.trim().length > 30);
    }
  }
  assert.ok(storybookChapters[2].choices.every((choice) => choice.ending.trim().length > 35),
    "each final choice should lead to a complete ending");
});


test("copyable story text matches the selected path and current sky wish", () => {
  const selectedPath = storybookChapters.map((chapter, index) => chapter.choices[index]);
  const wish = { text: "May Malika find gentle mornings and unexpected flowers." };
  const result = composeMimisStorybookText(selectedPath, wish);

  assert.ok(result.startsWith("Mimi's tiny fairytale for Malika"));
  for (const choice of selectedPath) assert.ok(result.includes(choice.passage));
  assert.ok(result.includes(selectedPath[2].ending));
  assert.ok(result.includes("A wish from your sky:\n" + wish.text));
  assert.ok(result.includes("already dreaming of the next little adventure"));
  assert.ok(!result.includes("Mimi padded after a star"));
});

test("copyable story text omits the optional wish when there is none and rejects incomplete paths", () => {
  const selectedPath = storybookChapters.map((chapter, index) => chapter.choices[index]);
  const result = composeMimisStorybookText(selectedPath);
  assert.ok(result.includes("Mimi's tiny fairytale for Malika"));
  assert.ok(!result.includes("A wish from your sky:"));
  assert.equal(composeMimisStorybookText([selectedPath[0], null, selectedPath[2]]), "");
});
