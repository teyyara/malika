import React, { useEffect, useId, useState } from "react";
import {
  getCuteSoundLevels,
  isCuteSoundEnabled,
  playCuteSound,
  setCuteSoundChannelVolume,
  setCuteSoundEnabled,
  setCuteSoundVolume,
  subscribeToCuteSounds,
  subscribeToCuteSoundVolume
} from "../audio/soundEffects.js";

const percent = (value) => Math.round(value * 100);

export default function TinySoundToggle({ floating = false }) {
  const [enabled, setEnabled] = useState(isCuteSoundEnabled);
  const [unsupported, setUnsupported] = useState(false);
  const [levels, setLevels] = useState(getCuteSoundLevels);
  const mixerId = useId().replace(/:/g, "");
  const masterId = mixerId + "-master";
  const mimiId = mixerId + "-mimi";
  const musicId = mixerId + "-music";
  const effectsId = mixerId + "-effects";

  useEffect(() => subscribeToCuteSounds(setEnabled), []);
  useEffect(() => subscribeToCuteSoundVolume(setLevels), []);

  async function toggleSound() {
    setUnsupported(false);
    const success = await setCuteSoundEnabled(!enabled);
    if (!success) setUnsupported(true);
  }

  function changeMasterVolume(event) {
    setCuteSoundVolume(Number(event.currentTarget.value) / 100);
  }

  function changeChannelVolume(channel, event) {
    setCuteSoundChannelVolume(channel, Number(event.currentTarget.value) / 100);
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
      <summary aria-label="Open sound mixer" title="Balance Mimi, music and game sounds">Mixer</summary>
      <div className="tiny-sound-mixer-panel">
        <div className="tiny-sound-volume-heading">
          <label htmlFor={masterId}>Overall volume</label>
          <output htmlFor={masterId}>{percent(levels.master)}%</output>
        </div>
        <input id={masterId} className="tiny-sound-volume" type="range" min="0" max="100" step="1"
          value={percent(levels.master)} onChange={changeMasterVolume} aria-label="Overall sound volume" />

        <p className="tiny-sound-mixer-caption">Balance the little layers</p>
        <div className="tiny-sound-channel">
          <div className="tiny-sound-volume-heading">
            <label htmlFor={mimiId}>Mimi’s voice</label><output htmlFor={mimiId}>{percent(levels.mimi)}%</output>
          </div>
          <input id={mimiId} className="tiny-sound-volume" type="range" min="0" max="100" step="1"
            value={percent(levels.mimi)} onChange={(event) => changeChannelVolume("mimi", event)} aria-label="Mimi voice volume" />
        </div>
        <div className="tiny-sound-channel">
          <div className="tiny-sound-volume-heading">
            <label htmlFor={musicId}>Love-note music</label><output htmlFor={musicId}>{percent(levels.music)}%</output>
          </div>
          <input id={musicId} className="tiny-sound-volume" type="range" min="0" max="100" step="1"
            value={percent(levels.music)} onChange={(event) => changeChannelVolume("music", event)} aria-label="Love-note music volume" />
        </div>
        <div className="tiny-sound-channel">
          <div className="tiny-sound-volume-heading">
            <label htmlFor={effectsId}>Games and little sounds</label><output htmlFor={effectsId}>{percent(levels.effects)}%</output>
          </div>
          <input id={effectsId} className="tiny-sound-volume" type="range" min="0" max="100" step="1"
            value={percent(levels.effects)} onChange={(event) => changeChannelVolume("effects", event)} aria-label="Game and effects volume" />
        </div>

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
