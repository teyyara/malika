import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import CatCharacter from "./CatCharacter.jsx";
import Ladybug from "./Ladybug.jsx";
import { preparedWishes } from "../data/wishes.js";
import { playCuteSound, setMusicOverride } from "../audio/soundEffects.js";
import MimisStorybook from "./MimisStorybook.jsx";

const studioTabs = [
  { id: "mimi", label: "Mimi's little life", glyph: "🐾" },
  { id: "wishes", label: "Wish sky", glyph: "✦" },
  { id: "music", label: "Our soundtrack", glyph: "♫" },
  { id: "picture", label: "Living picture", glyph: "♡" },
  { id: "storybook", label: "Mimi's tiny storybook", glyph: "✧" }
];

const mimiRoutine = [
  { mood: "curious", title: "On star-watch duty", line: "Mimi is keeping a very serious eye on the constellations." },
  { mood: "sleepy", title: "A tiny nap break", line: "Mimi has decided a little nap is essential to birthday operations." },
  { mood: "happy", title: "Butterfly emergency", line: "Mimi just spotted a butterfly and has forgotten every responsibility." },
  { mood: "love", title: "Saving you a purr", line: "Mimi is saving one especially warm purr for Malika." }
];

const mimiActions = {
  pet: { mood: "love", message: "Mimi leans into your hand. This is now officially a cuddle appointment.", sound: "purr" },
  play: { mood: "happy", message: "Ribbon spotted. Dignity lost. Mimi has entered full zoomie mode.", sound: "dance" },
  nap: { mood: "sleepy", message: "Mimi has curled into a lavender comma. Please admire quietly.", sound: "purr" },
  sweet: { mood: "love", message: "You whisper something sweet. Mimi slow-blinks, which is practically a love letter.", sound: "purr" }
};

const tracks = [
  { id: "garden", theme: "garden", title: "A walk in our garden", mood: "Airy plucks · soft starlight", glyph: "✿" },
  { id: "rain", theme: "soundtrack-rainy-window", title: "Rain against the window", mood: "Gentle rain-day daydream", glyph: "☂" },
  { id: "stars", theme: "soundtrack-starlight", title: "A sky full of stars", mood: "Little bells · cosmic hush", glyph: "✦" },
  { id: "cozy", theme: "soundtrack-cozy-evening", title: "One more cozy evening", mood: "Warm chords · slow breathing", glyph: "☾" },
  { id: "birthday", theme: "birthday-letter", title: "A song for your birthday", mood: "Soft, romantic, and yours", glyph: "♡" }
];

export default function GardenCompanionStudio({ discoveredCount, heartsCollected, releasedWishes, onReleaseWish }) {
  const [activeTab, setActiveTab] = useState("mimi");
  const [activeTrack, setActiveTrack] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => () => {
    setMusicOverride("soundtrack-player", null);
  }, []);

  function playTrack(track) {
    setActiveTrack(track.id);
    setMusicOverride("soundtrack-player", track.theme);
  }

  function pauseTrack() {
    setMusicOverride("soundtrack-player", null);
    setActiveTrack(null);
  }

  return <section className="companion-studio" aria-labelledby="companion-studio-heading">
    <div className="companion-studio-heading">
      <p className="eyebrow">✦ a little corner of the universe</p>
      <h2 id="companion-studio-heading">The little things that make this world <em>ours.</em></h2>
      <p>Mimi has her own tiny routine, the sky keeps track of your discoveries, and there is always room for one more wish.</p>
    </div>
    <div className="companion-tab-list" role="tablist" aria-label="Explore the little universe">
      {studioTabs.map((tab) => <button
        key={tab.id}
        type="button"
        role="tab"
        id={"companion-tab-" + tab.id}
        aria-selected={activeTab === tab.id}
        aria-controls={"companion-panel-" + tab.id}
        className={"companion-tab" + (activeTab === tab.id ? " is-active" : "")}
        onClick={() => setActiveTab(tab.id)}
      ><span aria-hidden="true">{tab.glyph}</span>{tab.label}</button>)}
    </div>
    <div className="companion-panel-wrap">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          id={"companion-panel-" + activeTab}
          role="tabpanel"
          aria-labelledby={"companion-tab-" + activeTab}
          className={"companion-panel companion-panel-" + activeTab}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
        >
          {activeTab === "mimi" && <MimiDailyLife discoveredCount={discoveredCount} heartsCollected={heartsCollected} />}
          {activeTab === "wishes" && <WishSky releasedWishes={releasedWishes} onReleaseWish={onReleaseWish} />}
          {activeTab === "music" && <SoundtrackPlayer activeTrack={activeTrack} onPlayTrack={playTrack} onPauseTrack={pauseTrack} />}
          {activeTab === "picture" && <LivingPicture />}
          {activeTab === "storybook" && <MimisStorybook />}
        </motion.div>
      </AnimatePresence>
    </div>
    <p className="companion-studio-footnote">Everything stays in this visit. No account, upload, or outside service needed. ♡</p>
  </section>;
}

function MimiDailyLife({ discoveredCount, heartsCollected }) {
  const [routineIndex, setRoutineIndex] = useState(0);
  const [mood, setMood] = useState(mimiRoutine[0].mood);
  const [mimiNote, setMimiNote] = useState("");
  const routineCursor = useRef(0);
  const holdRoutineUntil = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < holdRoutineUntil.current) return;
      const next = (routineCursor.current + 1) % mimiRoutine.length;
      routineCursor.current = next;
      setRoutineIndex(next);
      setMood(mimiRoutine[next].mood);
      setMimiNote("");
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  function respond(action) {
    const response = mimiActions[action];
    if (!response) return;
    holdRoutineUntil.current = Date.now() + 18000;
    setMood(response.mood);
    setMimiNote(response.message);
    playCuteSound(response.sound);
  }

  const currentMoment = mimiRoutine[routineIndex];
  return <div className="mimi-life-layout">
    <div className={"mimi-life-stage mood-" + mood}>
      <span className="mimi-life-orbit mimi-life-orbit-one" aria-hidden="true" />
      <span className="mimi-life-orbit mimi-life-orbit-two" aria-hidden="true" />
      <span className="mimi-life-moon" aria-hidden="true">☾</span>
      <div className="mimi-life-cat"><CatCharacter mood={mood} onClick={() => respond("pet")} label="Pet Mimi and see how she reacts" /></div>
      <span className="mimi-life-stage-caption">Mimi, in her own little world</span>
    </div>
    <div className="mimi-life-copy">
      <p className="companion-kicker"><span aria-hidden="true">✧</span> {mimiNote ? "Mimi has something to say" : currentMoment.title}</p>
      <h3>She has a whole tiny life of her own.</h3>
      <p className="mimi-life-message" aria-live="polite">{mimiNote || currentMoment.line}</p>
      <p className="mimi-life-stats"><span>♡ {discoveredCount} little notes found</span><span>✦ {heartsCollected} hearts collected</span></p>
      <div className="mimi-love-language">
        <p className="mimi-love-language-title">How shall we say hello?</p>
        <div className="mimi-action-grid">
          <button type="button" className="mimi-action" onClick={() => respond("pet")}><span aria-hidden="true">♡</span> A cuddle</button>
          <button type="button" className="mimi-action" onClick={() => respond("play")}><span aria-hidden="true">〰</span> Play with ribbon</button>
          <button type="button" className="mimi-action" onClick={() => respond("nap")}><span aria-hidden="true">☾</span> Cozy nap</button>
          <button type="button" className="mimi-action" onClick={() => respond("sweet")}><span aria-hidden="true">✉</span> Tell her a secret</button>
        </div>
      </div>
      <p className="mimi-life-disclaimer">Her little habits change while you explore. A pet, a ribbon, or a kind word gives her a different kind of happy.</p>
    </div>
  </div>;
}

function WishSky({ releasedWishes, onReleaseWish }) {
  const [draft, setDraft] = useState("");
  const [chosenPreparedId, setChosenPreparedId] = useState(preparedWishes[0].id);
  const [selectedWishId, setSelectedWishId] = useState(releasedWishes.at(-1)?.id || null);
  const selectedWish = releasedWishes.find((wish) => wish.id === selectedWishId) || null;

  function choosePrepared(wish) {
    setChosenPreparedId(wish.id);
    setDraft(wish.text);
  }

  function releaseWish(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const id = onReleaseWish(text);
    setSelectedWishId(id);
    setDraft("");
  }

  return <div className="wish-sky-layout">
    <div className="wish-sky-topline">
      <div><p className="companion-kicker">✦ your own little constellation</p><h3>Give a wish to the sky.</h3></div>
      <span className="wish-counter"><strong>{releasedWishes.length}</strong> {releasedWishes.length === 1 ? "wish released" : "wishes released"}</span>
    </div>
    <div className="wish-sky-field" aria-label="Your collection of released wishes">
      <span className="wish-sky-moon" aria-hidden="true">☾</span>
      <span className="wish-sky-orbit" aria-hidden="true" />
      {releasedWishes.length === 0 && <p className="wish-sky-empty">Your first little star is waiting for a wish.</p>}
      {releasedWishes.map((wish) => <button
        key={wish.id}
        type="button"
        className={"released-wish-star" + (wish.id === selectedWishId ? " is-selected" : "")}
        style={{ left: wish.left + "%", top: wish.top + "%", "--wish-delay": wish.delay }}
        aria-label={"Read released wish: " + wish.text}
        aria-pressed={wish.id === selectedWishId}
        onClick={() => setSelectedWishId(wish.id)}
      ><span aria-hidden="true">✦</span></button>)}
      {releasedWishes.length > 0 && <span className="wish-sky-count">{releasedWishes.length} little {releasedWishes.length === 1 ? "light" : "lights"} for Malika</span>}
    </div>
    <div className="wish-selected-note" aria-live="polite">
      {selectedWish ? <><span aria-hidden="true">♡</span><p>{selectedWish.text}</p><small>Released with love by Zack</small></> : <p>Choose a star after its wish has taken flight.</p>}
    </div>
    <div className="wish-compose-layout">
      <form className="wish-compose" onSubmit={releaseWish}>
        <label className="wish-input-label" htmlFor="wish-draft">Write a wish in your own words</label>
        <textarea id="wish-draft" value={draft} maxLength={160} rows={3} placeholder="May a hundred little things make you smile…" onChange={(event) => setDraft(event.target.value)} />
        <div className="wish-compose-footer"><span>{draft.length}/160</span><button className="button button-primary wish-release-button" type="submit" disabled={!draft.trim()}>Release into the sky <span aria-hidden="true">✦</span></button></div>
      </form>
      <div className="prepared-wishes">
        <p className="wish-input-label">A wish from Zack, ready to fly</p>
        <div className="prepared-wish-list">
          {preparedWishes.map((wish) => <button key={wish.id} type="button"
            className={"prepared-wish" + (chosenPreparedId === wish.id ? " is-selected" : "")}
            aria-pressed={chosenPreparedId === wish.id}
            onClick={() => choosePrepared(wish)}
          ><span aria-hidden="true">✧</span><span><strong>{wish.title}</strong><small>{wish.text}</small></span></button>)}
        </div>
      </div>
    </div>
    {releasedWishes.length > 0 && <div className="released-wish-collection">
      <p className="wish-input-label">Every wish has a little place here</p>
      <div className="released-wish-list">
        {releasedWishes.map((wish, index) => <button type="button" key={wish.id} className={wish.id === selectedWishId ? "is-selected" : ""}
          onClick={() => setSelectedWishId(wish.id)}><span aria-hidden="true">{index + 1 < 10 ? "0" + (index + 1) : index + 1}</span>{wish.text}</button>)}
      </div>
    </div>}
  </div>;
}

function SoundtrackPlayer({ activeTrack, onPlayTrack, onPauseTrack }) {
  const selected = tracks.find((track) => track.id === activeTrack);
  return <div className="soundtrack-player-layout">
    <div className="soundtrack-player-copy">
      <p className="companion-kicker">♫ a tiny mixtape, made with love</p>
      <h3>Choose the feeling for this little moment.</h3>
      <p>Every track is composed in the browser, just for this world. Pick a mood and let the garden soundtrack follow you while you stay here.</p>
      <div className={"soundtrack-now-playing" + (selected ? " is-playing" : "")} aria-live="polite">
        <span className="soundtrack-disc" aria-hidden="true">{selected?.glyph || "♫"}</span>
        <span><small>{selected ? "NOW PLAYING" : "READY WHEN YOU ARE"}</small><strong>{selected?.title || "Choose a little soundtrack"}</strong><em>{selected?.mood || "No downloads. No adverts. Just tiny notes."}</em></span>
        <span className="soundtrack-equalizer" aria-hidden="true"><i /><i /><i /><i /></span>
      </div>
      {activeTrack && <button type="button" className="soundtrack-pause" onClick={onPauseTrack}>Pause our soundtrack <span aria-hidden="true">Ⅱ</span></button>}
    </div>
    <div className="soundtrack-track-list" aria-label="Choose a soundtrack">
      {tracks.map((track) => <button key={track.id} type="button" aria-pressed={activeTrack === track.id}
        className={"soundtrack-track" + (activeTrack === track.id ? " is-playing" : "")}
        onClick={() => onPlayTrack(track)}
      ><span className="soundtrack-track-glyph" aria-hidden="true">{track.glyph}</span><span><strong>{track.title}</strong><small>{track.mood}</small></span><span className="soundtrack-track-action" aria-hidden="true">{activeTrack === track.id ? "Ⅱ" : "▶"}</span></button>)}
      <p className="soundtrack-player-hint">Sound can be silenced at any time with the sound control in the header. Your choice resets when you leave the garden.</p>
    </div>
  </div>;
}

function LivingPicture() {
  const [alive, setAlive] = useState(false);
  const [pictureCount, setPictureCount] = useState(0);

  function wakePicture() {
    const next = !alive;
    setAlive(next);
    if (next) {
      setPictureCount((count) => count + 1);
      playCuteSound("reveal");
    }
  }

  return <div className="living-picture-layout">
    <div>
      <p className="companion-kicker">♡ a moment you can wake up</p>
      <h3>A little picture, with a little life inside.</h3>
      <p className="living-picture-description">Tap the frame. Mimi, the stars, and a very small ladybug have been waiting to say hello.</p>
      <p className="living-picture-count" aria-live="polite">{alive ? "The picture is awake. Look closely… ♡" : pictureCount ? "Whenever you miss a little magic, wake it up again." : "A still moment, until you make it move."}</p>
      <button className="button button-primary living-picture-cta" type="button" aria-pressed={alive} onClick={wakePicture}>
        {alive ? "Let the moment rest" : "Bring the picture to life"} <span aria-hidden="true">{alive ? "☾" : "✧"}</span>
      </button>
    </div>
    <button type="button" className={"living-picture-frame" + (alive ? " is-alive" : "")}
      aria-label={alive ? "The living picture is awake; click to let it rest" : "Bring the framed picture of Mimi and a ladybug to life"}
      aria-pressed={alive} onClick={wakePicture}>
      <span className="living-picture-paper">
        <span className="living-picture-sky" aria-hidden="true"><i /><i /><i /><b>☾</b></span>
        <span className="living-picture-mimi"><CatCharacter mood={alive ? "happy" : "curious"} /></span>
        <span className="living-picture-bug"><Ladybug decorative /></span>
        <span className="living-picture-light picture-light-one" aria-hidden="true">✦</span>
        <span className="living-picture-light picture-light-two" aria-hidden="true">♡</span>
      </span>
      <span className="living-picture-caption"><strong>One tiny moment to keep</strong><small>for Malika, always · Zack ♡</small></span>
    </button>
  </div>;
}
