import React, { useEffect, useId, useState } from "react";
import {
  getCuteSoundVolume,
  isCuteSoundEnabled,
  playCuteSound,
  setCuteSoundEnabled,
  setCuteSoundVolume,
  subscribeToCuteSounds,
  subscribeToCuteSoundVolume
} from "../audio/soundEffects.js";

export default function TinySoundToggle({ floating = false }) {
  const [enabled, setEnabled] = useState(isCuteSoundEnabled);
  const [unsupported, setUnsupported] = useState(false);
  const [volume, setVolume] = useState(() => Math.round(getCuteSoundVolume() * 100));
  const volumeId = useId().replace(/:/g, "");

  useEffect(() => subscribeToCuteSounds(setEnabled), []);
  useEffect(() => subscribeToCuteSoundVolume((nextVolume) => setVolume(Math.round(nextVolume * 100))), []);

  async function toggleSound() {
    setUnsupported(false);
    const success = await setCuteSoundEnabled(!enabled);
    if (!success) setUnsupported(true);
  }

  function changeVolume(event) {
    const nextVolume = Number(event.currentTarget.value);
    setVolume(nextVolume);
    setCuteSoundVolume(nextVolume / 100);
  }

  return <div className={"tiny-sound-control" + (floating ? " is-floating" : "")}>
    <button type="button" className={"tiny-sound-toggle" + (enabled ? " is-enabled" : "")}
      onClick={toggleSound} aria-pressed={enabled}
      aria-label={enabled ? "Turn off tiny sounds" : "Turn on tiny sounds"}
      title={enabled ? "Mimi’s meows, purrs and music are on — click to hush the universe" : "Turn on Mimi’s recorded meows, purrs, love song and tiny rewards"}>
      <span className="tiny-sound-glyph" aria-hidden="true">{enabled ? "♫" : "♪"}</span>
      <span>{enabled ? "Sound on" : "Sound off"}</span>
    </button>
    <details className="tiny-sound-mixer">
      <summary aria-label="Open sound mixer" title="Adjust the sound level and preview Mimi">Mixer</summary>
      <div className="tiny-sound-mixer-panel">
        <div className="tiny-sound-volume-heading">
          <label htmlFor={volumeId}>Overall volume</label>
          <output htmlFor={volumeId}>{volume}%</output>
        </div>
        <input id={volumeId} className="tiny-sound-volume" type="range" min="0" max="100" step="1"
          value={volume} onChange={changeVolume} aria-label="Overall sound volume" />
        <p className="tiny-sound-mixer-caption">A little sound check for Mimi</p>
        <div className="tiny-sound-preview-buttons">
          <button type="button" disabled={!enabled} onClick={() => playCuteSound("meow")}>Hear a meow</button>
          <button type="button" disabled={!enabled} onClick={() => playCuteSound("purr")}>Hear a purr</button>
        </div>
        {!enabled && <p className="tiny-sound-mixer-hint">Turn sound on first to preview the recordings.</p>}
      </div>
    </details>
    {unsupported && <span className="tiny-sound-unavailable" role="status">Sound is unavailable in this browser.</span>}
  </div>;
}
