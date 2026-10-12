import React, { useEffect, useRef, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const STARS = [
  { id: 1, x: 13, y: 24 }, { id: 2, x: 31, y: 14 }, { id: 3, x: 50, y: 30 },
  { id: 4, x: 72, y: 18 }, { id: 5, x: 87, y: 38 }, { id: 6, x: 23, y: 54 },
  { id: 7, x: 43, y: 65 }, { id: 8, x: 67, y: 53 }, { id: 9, x: 82, y: 76 },
  { id: 10, x: 12, y: 81 }, { id: 11, x: 55, y: 84 }, { id: 12, x: 93, y: 16 }
];
const FIREFLIES = [
  { id: 1, x: 12, y: 28 }, { id: 2, x: 34, y: 18 }, { id: 3, x: 76, y: 27 },
  { id: 4, x: 88, y: 55 }, { id: 5, x: 63, y: 73 }, { id: 6, x: 37, y: 62 },
  { id: 7, x: 18, y: 77 }, { id: 8, x: 52, y: 42 }
];
const MEMORY_CARDS = [
  { id: "moon-a", pair: "moon", symbol: "🌙", label: "moon" },
  { id: "paw-a", pair: "paw", symbol: "🐾", label: "pawprints" },
  { id: "heart-a", pair: "heart", symbol: "💜", label: "purple heart" },
  { id: "heart-b", pair: "heart", symbol: "💜", label: "purple heart" },
  { id: "moon-b", pair: "moon", symbol: "🌙", label: "moon" },
  { id: "paw-b", pair: "paw", symbol: "🐾", label: "pawprints" }
];
const RHYTHM = ["🐾", "🌙", "💜", "✨"];
const WISHES = [
  "May a tiny ordinary moment become one of your favourite stories.",
  "A future little adventure is waiting for you to say yes.",
  "May you always find a soft place to land and a reason to smile.",
  "One day, a perfect quiet evening will include a very spoiled cat.",
  "May this next chapter bring brave plans, gentle surprises, and bright mornings."
];
const REVEALS = {
  moon: { title: "The moon kept a secret", copy: "You tapped seven times and woke up the little moon. It has one wish for Malika: may your next chapter be full of soft landings and impossible-looking stars.", glyph: "☾" },
  paws: { title: "Mimi's fifth hello", copy: "That was not an ordinary pet. Mimi has been rehearsing a tiny birthday dance and has officially promoted you to Head of Cat Appreciation.", glyph: "🐾" },
  starfall: { title: "Her name lit up the sky", copy: "You spelled MALIKA and the sky answered. Imagine a little lavender comet crossing the garden just for you. Keep that wish close.", glyph: "☄" },
  footer: { title: "A tiny star said thank you", copy: "Even the smallest star in this little universe wanted to leave you something: take your time, make a wish, and keep a little wonder for yourself.", glyph: "✧" }
};

function addUnique(setter, id) {
  setter((previous) => previous.includes(id) ? previous : [...previous, id]);
}

export default function EasterEggSystem() {
  const [panel, setPanel] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const [activeGame, setActiveGame] = useState(null);
  const [revealId, setRevealId] = useState("moon");
  const [unlocked, setUnlocked] = useState([]);
  const [toast, setToast] = useState("");
  const [caughtStars, setCaughtStars] = useState([]);
  const [caughtFireflies, setCaughtFireflies] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [rhythmStep, setRhythmStep] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [wishIndex, setWishIndex] = useState(-1);
  const sequenceIndex = useRef(0);
  const typedBuffer = useRef("");
  const counters = useRef({});
  const toastTimer = useRef(null);

  function announce(text) {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 6200);
  }

  function openArcade(achievement) {
    if (!panel) openerRef.current = document.activeElement;
    if (achievement) addUnique(setUnlocked, achievement);
    setPanel("cabinet");
    setActiveGame(null);
    setGameWon(false);
  }

  function openReveal(id) {
    if (!panel) openerRef.current = document.activeElement;
    setRevealId(id);
    setPanel("reveal");
    addUnique(setUnlocked, id);
  }

  function startGame(id) {
    setActiveGame(id);
    setPanel("game");
    setCaughtStars([]);
    setCaughtFireflies([]);
    setOpenedCards([]);
    setMatchedCards([]);
    setRhythmStep(0);
    setGameWon(false);
    setWishIndex(-1);
  }

  function bump(name, threshold, windowMs, onHit) {
    const now = Date.now();
    const previous = counters.current[name];
    const next = !previous || now - previous.startedAt > windowMs
      ? { count: 1, startedAt: now }
      : { count: previous.count + 1, startedAt: previous.startedAt };
    counters.current[name] = next;
    if (next.count >= threshold) {
      counters.current[name] = { count: 0, startedAt: now };
      onHit();
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (panel && event.key === "Tab") {
        const dialog = dialogRef.current;
        const focusable = dialog ? Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')) : [];
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
            return;
          }
        }
      }
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || event.target?.isContentEditable) return;
      if (event.key === "Escape" && panel) {
        setPanel(null);
        setActiveGame(null);
        return;
      }

      const expected = KONAMI[sequenceIndex.current];
      if (event.key.toLowerCase() === expected.toLowerCase()) {
        sequenceIndex.current += 1;
        if (sequenceIndex.current === KONAMI.length) {
          sequenceIndex.current = 0;
          openArcade("konami");
        }
      } else {
        sequenceIndex.current = event.key === KONAMI[0] ? 1 : 0;
      }

      if (/^[a-z]$/i.test(event.key)) {
        typedBuffer.current = (typedBuffer.current + event.key.toUpperCase()).slice(-6);
        if (typedBuffer.current.endsWith("MALIKA")) {
          typedBuffer.current = "";
          openReveal("starfall");
        } else if (typedBuffer.current.endsWith("MIMI")) {
          typedBuffer.current = "";
          startGame("memory");
          addUnique(setUnlocked, "mimi-code");
        }
      } else if (event.key.length === 1) {
        typedBuffer.current = "";
      }
    }

    function onClick(event) {
      if (event.target.closest(".egg-backdrop")) return;
      if (event.target.closest(".secret-moon-trigger")) {
        bump("moon", 7, 9000, () => openReveal("moon"));
      }
      if (event.target.closest(".brand-heart")) {
        bump("brandHeart", 5, 7000, () => openArcade("heart-mark"));
      }
      if (event.target.closest(".cat-character-button")) {
        bump("cat", 5, 8000, () => openReveal("paws"));
      }
      if (event.target.closest(".ladybug-button")) {
        bump("ladybugs", 4, 9000, () => {
          addUnique(setUnlocked, "firefly-trail");
          announce("Four ladybugs, one hidden trail. A firefly game just fluttered into the Secret Arcade.");
        });
      }
      if (event.target.closest(".site-footer > span:last-child")) {
        bump("footerStar", 3, 7000, () => openReveal("footer"));
      }
    }

    if (panel) dialogRef.current?.querySelector(".egg-close")?.focus();
    else if (openerRef.current && !dialogRef.current) {
      openerRef.current.focus?.();
      openerRef.current = null;
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      window.clearTimeout(toastTimer.current);
    };
  }, [panel]);

  function flipCard(id) {
    if (matchedCards.includes(id) || openedCards.includes(id) || gameWon) return;
    if (openedCards.length >= 2) {
      setOpenedCards([id]);
      return;
    }
    const next = [...openedCards, id];
    setOpenedCards(next);
    if (next.length === 2) {
      const first = MEMORY_CARDS.find((card) => card.id === next[0]);
      const second = MEMORY_CARDS.find((card) => card.id === next[1]);
      if (first.pair === second.pair) {
        const pairs = [...matchedCards, ...next];
        setMatchedCards(pairs);
        if (pairs.length === MEMORY_CARDS.length) setGameWon(true);
      }
    }
  }

  function playRhythm(symbol) {
    if (gameWon) return;
    if (symbol === RHYTHM[rhythmStep]) {
      const next = rhythmStep + 1;
      setRhythmStep(next);
      if (next === RHYTHM.length) {
        setGameWon(true);
        addUnique(setUnlocked, "mimi-rhythm");
      }
    } else {
      setRhythmStep(symbol === RHYTHM[0] ? 1 : 0);
      announce("Mimi blinked! The rhythm starts with pawprints. Give it another try.");
    }
  }

  function renderMiniGame() {
    if (activeGame === "stars") return <div className="egg-game-content">
      <p className="egg-game-instructions">Catch seven stars before the night hides them again. Every star is a button, and there is no timer.</p>
      <div className="egg-star-field" aria-label="Secret star field">
        {STARS.map((star) => <button key={star.id} type="button" className={caughtStars.includes(star.id) ? "egg-star-token is-caught" : "egg-star-token"}
          style={{ left: star.x + "%", top: star.y + "%" }} disabled={caughtStars.includes(star.id)}
          aria-label={caughtStars.includes(star.id) ? "Star " + star.id + " caught" : "Catch secret star " + star.id}
          onClick={() => { const next = [...caughtStars, star.id]; setCaughtStars(next); if (next.length >= 7) { setGameWon(true); addUnique(setUnlocked, "seven-stars"); } }}>
          {caughtStars.includes(star.id) ? "✦" : "✧"}
        </button>)}
      </div>
      <p className="egg-progress" aria-live="polite">{caughtStars.length} / 7 stars caught</p>
      {gameWon && <p className="egg-win" role="status">Star shower! Seven tiny lights are now yours. ✨</p>}
    </div>;

    if (activeGame === "memory") return <div className="egg-game-content">
      <p className="egg-game-instructions">Find the three matching pairs: moon, pawprints, and a purple heart. If two cards do not match, choose another to turn them down.</p>
      <div className="egg-memory-grid">
        {MEMORY_CARDS.map((card) => {
          const shown = openedCards.includes(card.id) || matchedCards.includes(card.id);
          return <button key={card.id} type="button" className={shown ? "egg-memory-card is-open" : "egg-memory-card"}
            aria-label={shown ? card.label : "Turn over memory card " + card.id}
            aria-pressed={shown} onClick={() => flipCard(card.id)}>
            {shown ? card.symbol : "✧"}
          </button>;
        })}
      </div>
      <p className="egg-progress" aria-live="polite">{matchedCards.length / 2} / 3 matching pairs found</p>
      {gameWon && <p className="egg-win" role="status">Mimi remembers all the little things. Memory keeper unlocked! 🐾</p>}
    </div>;

    if (activeGame === "rhythm") return <div className="egg-game-content">
      <p className="egg-game-instructions">Repeat Mimi's four-beat rhythm in the right order. The secret pattern begins with pawprints.</p>
      <div className="egg-rhythm-pad">
        {RHYTHM.map((symbol, index) => <button type="button" key={symbol} className="egg-rhythm-key" aria-label={"Play " + ["pawprints", "moon", "purple heart", "sparkle"][index]}
          onClick={() => playRhythm(symbol)} disabled={gameWon}>{symbol}</button>)}
      </div>
      <p className="egg-progress" aria-live="polite">{gameWon ? "Perfect rhythm!" : "Beats repeated: " + rhythmStep + " / " + RHYTHM.length}</p>
      {gameWon && <p className="egg-win" role="status">Paw, moon, heart, sparkle! Mimi does a little victory dance. ✨</p>}
    </div>;

    if (activeGame === "fireflies") return <div className="egg-game-content">
      <p className="egg-game-instructions">The ladybugs led you here. Catch five glowing fireflies, and the garden will give you a little extra light.</p>
      <div className="egg-firefly-field">
        {FIREFLIES.map((fly) => <button type="button" key={fly.id} className={caughtFireflies.includes(fly.id) ? "egg-firefly-token is-caught" : "egg-firefly-token"}
          style={{ left: fly.x + "%", top: fly.y + "%" }} disabled={caughtFireflies.includes(fly.id)}
          aria-label={caughtFireflies.includes(fly.id) ? "Firefly " + fly.id + " caught" : "Catch glowing firefly " + fly.id}
          onClick={() => { const next = [...caughtFireflies, fly.id]; setCaughtFireflies(next); if (next.length >= 5) { setGameWon(true); addUnique(setUnlocked, "five-fireflies"); } }}>
          {caughtFireflies.includes(fly.id) ? "✧" : "✦"}
        </button>)}
      </div>
      <p className="egg-progress" aria-live="polite">{caughtFireflies.length} / 5 fireflies caught</p>
      {gameWon && <p className="egg-win" role="status">The garden is glowing a little brighter because of you. ✨</p>}
    </div>;

    return <div className="egg-game-content">
      <p className="egg-game-instructions">A glass jar holds future-facing wishes, not memories. Shake it gently to discover one.</p>
      <div className={wishIndex >= 0 ? "egg-wish-jar has-wish" : "egg-wish-jar"} aria-hidden="true">🫙<span>✧</span><span>♡</span><span>✦</span></div>
      <button type="button" className="egg-action-button" onClick={() => { setWishIndex((previous) => (previous + 1) % WISHES.length); setUnlocked((previous) => previous.includes("wish-jar") ? previous : [...previous, "wish-jar"]); }}>
        Shake the wish jar <span aria-hidden="true">✧</span>
      </button>
      {wishIndex >= 0 && <p className="egg-wish-copy" key={wishIndex} role="status">{WISHES[wishIndex]}</p>}
    </div>;
  }

  const isGame = panel === "game";
  const reveal = REVEALS[revealId] || REVEALS.moon;
  const title = panel === "cabinet" ? "The secret arcade" : isGame
    ? ({ stars: "Seven-star catcher", memory: "Mimi's memory match", rhythm: "Mimi's pawprint rhythm", fireflies: "Firefly hunt", wishes: "The little wish jar" }[activeGame] || "A tiny secret")
    : reveal.title;

  return <>
    {toast && <div className="egg-toast" role="status"><span aria-hidden="true">✦</span><span>{toast}</span><button type="button" onClick={() => openArcade("firefly-trail")}>Open Secret Arcade</button><button className="egg-toast-dismiss" type="button" aria-label="Dismiss secret discovery" onClick={() => setToast("")}>×</button></div>}
    {panel && <div className="egg-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setPanel(null); setActiveGame(null); } }}>
      <section ref={dialogRef} className={"egg-dialog " + (panel === "reveal" ? "is-reveal" : "is-" + panel)} role="dialog" aria-modal="true" aria-labelledby="egg-dialog-title">
        <button className="egg-close" type="button" aria-label="Close secret surprise" onClick={() => { setPanel(null); setActiveGame(null); }}>×</button>
        <div className="egg-dialog-stars" aria-hidden="true">✦ · ✧ · ♥ · ✧ · ✦</div>
        <p className="egg-kicker">a hidden corner of Malika's universe</p>
        <h2 id="egg-dialog-title">{title}</h2>
        {panel === "reveal" && <div className="egg-reveal-content">
          <div className={"egg-reveal-glyph egg-reveal-" + revealId} aria-hidden="true">{reveal.glyph}</div>
          <p>{reveal.copy}</p>
          <div className="egg-burst" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--burst-angle": (index * 20) + "deg", "--burst-delay": (index % 6) * 0.06 + "s" }}>{["✦", "♡", "✧", "·"][index % 4]}</i>)}</div>
          <button type="button" className="egg-action-button" onClick={() => openArcade(revealId)}>Enter the Secret Arcade <span aria-hidden="true">↗</span></button>
        </div>}
        {panel === "cabinet" && <div className="egg-cabinet-content">
          <p className="egg-subtitle">You found the door behind the stars. Choose a little side quest; none of these games has a timer.</p>
          <div className="egg-game-list">
            <button type="button" className="egg-game-tile" onClick={() => startGame("stars")}><span>✧</span><strong>Seven-star catcher</strong><small>Catch 7 of 12 hidden stars</small></button>
            <button type="button" className="egg-game-tile" onClick={() => startGame("memory")}><span>🌙</span><strong>Mimi's memory match</strong><small>Find the moon, paw, and heart pairs</small></button>
            <button type="button" className="egg-game-tile" onClick={() => startGame("rhythm")}><span>🐾</span><strong>Pawprint rhythm</strong><small>Repeat Mimi's four-beat code</small></button>
            <button type="button" className="egg-game-tile" onClick={() => startGame("fireflies")}><span>✦</span><strong>Firefly hunt</strong><small>Catch 5 glowing fireflies</small></button>
            <button type="button" className="egg-game-tile" onClick={() => startGame("wishes")}><span>🫙</span><strong>The little wish jar</strong><small>Shake out a future-facing wish</small></button>
          </div>
          <div className="egg-unlock-counter"><span>Secrets uncovered</span><strong>{unlocked.length}</strong></div>
          {unlocked.length > 0 && <p className="egg-tiny-note">Your discoveries are kept for this visit only.</p>}
        </div>}
        {isGame && <div className="egg-game-panel">
          {renderMiniGame()}
          <div className="egg-game-actions">
            <button type="button" className="egg-text-button" onClick={() => openArcade()}>← Back to arcade</button>
            <button type="button" className="egg-text-button" onClick={() => startGame(activeGame)}>Play again ↻</button>
          </div>
        </div>}
      </section>
    </div>}
  </>;
}
