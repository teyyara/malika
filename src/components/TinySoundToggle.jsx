import React, { useEffect, useState } from "react";
import { isCuteSoundEnabled, setCuteSoundEnabled, subscribeToCuteSounds } from "../audio/soundEffects.js";

export default function TinySoundToggle({ floating = false }) {
  const [enabled, setEnabled] = useState(isCuteSoundEnabled);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => subscribeToCuteSounds(setEnabled), []);

  async function toggleSound() {
    setUnsupported(false);
    const success = await setCuteSoundEnabled(!enabled);
    if (!success) setUnsupported(true);
  }

  return <div className={"tiny-sound-control" + (floating ? " is-floating" : "")}>
    <button type="button" className={"tiny-sound-toggle" + (enabled ? " is-enabled" : "")}
      onClick={toggleSound} aria-pressed={enabled}
      aria-label={enabled ? "Turn off tiny sounds" : "Turn on tiny sounds"}
      title={enabled ? "Tiny sounds are on — click to hush the universe" : "Turn on a few tiny synthesized chimes"}>
      <span className="tiny-sound-glyph" aria-hidden="true">{enabled ? "♫" : "♪"}</span>
      <span>{enabled ? "Sound on" : "Sound off"}</span>
    </button>
    {unsupported && <span className="tiny-sound-unavailable" role="status">Sound is unavailable in this browser.</span>}
  </div>;
}
