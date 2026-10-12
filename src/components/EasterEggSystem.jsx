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
const ARCADE_GAMES = ["stars", "memory", "rhythm", "fireflies", "wishes"];
const GAME_REWARDS = {
  stars: { theme: "starlight", eyebrow: "THE SKY IS CHEERING FOR YOU", title: "A whole galaxy belongs to you.", glyph: "✦", copy: "Seven little lights were hiding in the dark, and you found every single one. Look what happens when curiosity gets to lead.", detail: "A pocketful of stardust, collected just for you.", score: "7 / 7 stars caught" },
  memory: { theme: "memory", eyebrow: "EVERY LITTLE THING MATTERS", title: "You remembered every little wonder.", glyph: "💜", copy: "Moon, pawprints, and purple hearts — every pair found its way home. Mimi has decided your memory deserves its very own constellation.", detail: "Three perfect pairs. A thousand tiny connections.", score: "3 / 3 matching pairs" },
  rhythm: { theme: "rhythm", eyebrow: "MAKE SOME NOISE, LITTLE STAR", title: "Mimi's tiny concert is a HIT!", glyph: "🐾", copy: "Paw, moon, heart, sparkle — four beats, one flawless little dance. Mimi would take a bow, if she weren't busy celebrating you.", detail: "Perfect rhythm. Maximum tiny-paw energy.", score: "4 / 4 beats in sync" },
  fireflies: { theme: "fireflies", eyebrow: "YOU MADE THE NIGHT GLOW", title: "You just lit up the whole garden.", glyph: "✧", copy: "Five fireflies have found their light, and suddenly the whole garden feels like a secret summer evening.", detail: "Five golden sparks, all glowing because of you.", score: "5 / 5 fireflies caught" },
  wishes: { theme: "wishes", eyebrow: "A LITTLE MAGIC FOR THE FUTURE", title: "Five wishes. One very bright future.", glyph: "♡", copy: "You opened every tiny wish tucked inside the jar. They're not promises about what has happened — they're soft hopes for all the lovely things still waiting ahead.", detail: "Five wishes found. Your next little chapter is wide open.", score: "5 / 5 wishes revealed" }
};
const REWARD_SPARKS = ["✦", "✧", "♡", "♥", "✺", "✶", "✷", "💜", "⋆", "❋"];

const CELEBRATION_HEARTS = Array.from({ length: 24 }, (_, index) => ({
  id: index, glyph: index % 3 === 0 ? "♥" : index % 3 === 1 ? "♡" : "✦",
  style: {
    "--heart-angle": (index * 15) + "deg", "--heart-delay": (index % 8) * 0.025 + "s",
    "--heart-distance": (120 + (index % 9) * 30) + "px", "--heart-size": (13 + (index % 4) * 5) + "px"
  }
}));
const CELEBRATION_PARTICLES = Array.from({ length: 64 }, (_, index) => ({
  id: index, glyph: REWARD_SPARKS[index % REWARD_SPARKS.length],
  style: {
    "--particle-x": ((index * 37 + 11) % 100) + "%",
    "--particle-y": ((index * 61 + 7) % 108) + "%",
    "--particle-delay": -((index % 17) * 0.31) + "s",
    "--particle-duration": (3.8 + (index % 7) * 0.47) + "s",
    "--particle-drift": (((index * 19) % 150) - 75) + "px",
    "--particle-size": (8 + (index % 4) * 4) + "px"
  }
}));
const REVEAL_BURST = Array.from({ length: 18 }, (_, index) => ({
  id: index, glyph: ["✦", "♡", "✧", "·"][index % 4],
  style: { "--burst-angle": (index * 20) + "deg", "--burst-delay": (index % 6) * 0.06 + "s" }
}));
const GRAND_FLIGHT_OBJECTS = Array.from({ length: 112 }, (_, index) => ({
  id: index, className: "grand-flight-type-" + (index % 7),
  glyph: index % 6 === 0 ? "♥" : index % 6 === 1 ? "♡" : REWARD_SPARKS[index % REWARD_SPARKS.length],
  style: {
    "--grand-x": (((index * 73) % 1500) - 750) + "px",
    "--grand-y": (((index * 47) % 1050) - 525) + "px",
    "--grand-z": (((index * 29) % 850) - 425) + "px",
    "--grand-delay": -((index % 23) * 0.22) + "s",
    "--grand-duration": (4.2 + (index % 9) * 0.37) + "s",
    "--grand-rotate": (((index * 53) % 720) - 360) + "deg",
    "--grand-size": (12 + (index % 6) * 5) + "px"
  }
}));
const GRAND_COMETS = Array.from({ length: 9 }, (_, index) => ({
  id: index, style: { "--comet-angle": (index * 40) + "deg", "--comet-delay": (index * 0.12) + "s" }
}));
const GRAND_HEART_DEPTHS = Array.from({ length: 13 }, (_, index) => ({
  id: index,
  style: {
    "--heart-depth": index, "--heart-depth-z": (index * 4) + "px",
    "--heart-offset-y": (index * 0.7) + "px", "--heart-scale": (1 - index * 0.022),
    "--heart-brightness": (0.58 + index * 0.028)
  }
}));
const GRAND_TREASURES = ["✧", "☾", "🐾", "✦", "♡"].map((symbol, index) => ({
  symbol, index, style: { "--treasure-delay": (0.35 + index * 0.055) + "s" }
}));
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
  footer: { title: "A tiny star said thank you", copy: "Even the smallest star in this little universe wanted to leave you something: take your time, make a wish, and keep a little wonder for yourself.", glyph: "✧" },
  grand: { title: "Keeper of Little Wonders", copy: "You found every game, every hidden light, and every tiny corner of this universe. The grand secret was never just the stars or the prizes: it is the patience and curiosity you brought into this little world. Zack made this universe for Malika, and now you have found every last bit of its magic. Keep a little wonder for yourself. 💜", glyph: "✧" }
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
  const [completedGames, setCompletedGames] = useState([]);
  const [toast, setToast] = useState("");
  const [caughtStars, setCaughtStars] = useState([]);
  const [caughtFireflies, setCaughtFireflies] = useState([]);
  const [openedCards, setOpenedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMismatch, setMemoryMismatch] = useState(false);
  const [rhythmStep, setRhythmStep] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [celebrationId, setCelebrationId] = useState(null);
  const [wishIndex, setWishIndex] = useState(-1);
  const sequenceIndex = useRef(0);
  const typedBuffer = useRef("");
  const counters = useRef({});
  const toastTimer = useRef(null);
  const mismatchTimer = useRef(null);

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
    setCelebrationId(null);
    setGameWon(false);
  }

  function openReveal(id) {
    if (!panel || panel === "celebration") openerRef.current = document.activeElement;
    setRevealId(id);
    setPanel("reveal");
    addUnique(setUnlocked, id);
  }

  function returnToArcade() {
    setPanel("cabinet");
    setActiveGame(null);
  }

  function closePanel() {
    if (panel === "celebration") {
      returnToArcade();
    } else {
      setPanel(null);
      setActiveGame(null);
    }
  }

  function finishGame(id, achievement) {
    addUnique(setCompletedGames, id);
    if (achievement) addUnique(setUnlocked, achievement);
    setCelebrationId(id);
    setPanel("celebration");
  }

  function startGame(id) {
    setActiveGame(id);
    setPanel("game");
    setCaughtStars([]);
    setCaughtFireflies([]);
    window.clearTimeout(mismatchTimer.current);
    mismatchTimer.current = null;
    setOpenedCards([]);
    setMatchedCards([]);
    setMemoryMismatch(false);
    setRhythmStep(0);
    setGameWon(false);
    setCelebrationId(null);
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
        const focusable = dialog
          ? Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
            .filter((control) => !control.disabled && !control.closest('[hidden], [aria-hidden="true"]')
              && control.getClientRects().length > 0 && window.getComputedStyle(control).visibility !== "hidden")
          : [];
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const focusOutsideDialog = dialog && !dialog.contains(document.activeElement);
          if (event.shiftKey && (document.activeElement === first || focusOutsideDialog)) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && (document.activeElement === last || focusOutsideDialog)) {
            event.preventDefault();
            first.focus();
            return;
          }
        }
      }
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || event.target?.isContentEditable) return;
      if (event.key === "Escape" && panel) {
        closePanel();
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
      if (event.target.closest(".footer-star-trigger")) {
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
    };
  }, [panel]);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(mismatchTimer.current);
  }, []);

  function flipCard(id) {
    if (matchedCards.includes(id) || openedCards.includes(id) || gameWon) return;
    if (openedCards.length >= 2) {
      window.clearTimeout(mismatchTimer.current);
      mismatchTimer.current = null;
      setMemoryMismatch(false);
      setOpenedCards([id]);
      return;
    }
    const next = [...openedCards, id];
    setOpenedCards(next);
    if (next.length === 2) {
      const first = MEMORY_CARDS.find((card) => card.id === next[0]);
      const second = MEMORY_CARDS.find((card) => card.id === next[1]);
      if (first.pair === second.pair) {
        window.clearTimeout(mismatchTimer.current);
        mismatchTimer.current = null;
        setMemoryMismatch(false);
        const pairs = [...matchedCards, ...next];
        setMatchedCards(pairs);
        if (pairs.length === MEMORY_CARDS.length) {
          setGameWon(true);
          finishGame("memory", "memory-keeper");
        }
      } else {
        setMemoryMismatch(true);
        window.clearTimeout(mismatchTimer.current);
        mismatchTimer.current = window.setTimeout(() => {
          setOpenedCards((current) => current.length === 2 ? [] : current);
          setMemoryMismatch(false);
          mismatchTimer.current = null;
        }, 1050);
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
        finishGame("rhythm", "mimi-rhythm");
      }
    } else {
      setRhythmStep(symbol === RHYTHM[0] ? 1 : 0);
      announce("Mimi blinked! The rhythm starts with pawprints. Give it another try.");
    }
  }

  function shakeWishJar() {
    if (gameWon) return;
    const next = (wishIndex + 1) % WISHES.length;
    setWishIndex(next);
    addUnique(setUnlocked, "wish-jar");
    if (next === WISHES.length - 1) {
      setGameWon(true);
      finishGame("wishes", "five-wishes");
    }
  }

  function renderMiniGame() {
    if (activeGame === "stars") return <div className="egg-game-content">
      <p className="egg-game-instructions">Catch seven stars before the night hides them again. Every star is a button, and there is no timer.</p>
      <div className="egg-star-field" aria-label="Secret star field">
        {STARS.map((star) => <button key={star.id} type="button" className={caughtStars.includes(star.id) ? "egg-star-token is-caught" : "egg-star-token"}
          style={{ left: star.x + "%", top: star.y + "%" }} disabled={caughtStars.includes(star.id)}
          aria-label={caughtStars.includes(star.id) ? "Star " + star.id + " caught" : "Catch secret star " + star.id}
          onClick={() => { const next = [...caughtStars, star.id]; setCaughtStars(next); if (next.length >= 7) { setGameWon(true); finishGame("stars", "seven-stars"); } }}>
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
          const mismatch = memoryMismatch && openedCards.includes(card.id) && !matchedCards.includes(card.id);
          return <button key={card.id} type="button" className={"egg-memory-card" + (shown ? " is-open" : "") + (mismatch ? " is-mismatch" : "")}
            aria-label={shown ? card.label : "Turn over memory card " + card.id}
            aria-pressed={shown} onClick={() => flipCard(card.id)}>
            {shown ? card.symbol : "✧"}
          </button>;
        })}
      </div>
      <p className="egg-progress" aria-live="polite">{memoryMismatch ? "Not a match — the cards will turn back over shortly." : matchedCards.length / 2 + " / 3 matching pairs found"}</p>
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
          onClick={() => { const next = [...caughtFireflies, fly.id]; setCaughtFireflies(next); if (next.length >= 5) { setGameWon(true); finishGame("fireflies", "five-fireflies"); } }}>
          {caughtFireflies.includes(fly.id) ? "✧" : "✦"}
        </button>)}
      </div>
      <p className="egg-progress" aria-live="polite">{caughtFireflies.length} / 5 fireflies caught</p>
      {gameWon && <p className="egg-win" role="status">The garden is glowing a little brighter because of you. ✨</p>}
    </div>;

    return <div className="egg-game-content">
      <p className="egg-game-instructions">A glass jar holds future-facing wishes, not memories. Shake it gently to discover one.</p>
      <div className={wishIndex >= 0 ? "egg-wish-jar has-wish" : "egg-wish-jar"} aria-hidden="true">🫙<span>✧</span><span>♡</span><span>✦</span></div>
      <button type="button" className="egg-action-button" onClick={shakeWishJar} disabled={gameWon}>
        {gameWon ? "All five wishes revealed" : "Shake the wish jar"} <span aria-hidden="true">✧</span>
      </button>
      <p className="egg-progress" aria-live="polite">{Math.max(0, wishIndex + 1)} / {WISHES.length} wishes revealed</p>
      {wishIndex >= 0 && <p className="egg-wish-copy" key={wishIndex} role="status">{WISHES[wishIndex]}</p>}
      {gameWon && <p className="egg-win" role="status">All five wishes are yours. The final secret is now waiting in the arcade. ♡</p>}
    </div>;
  }

  const isGame = panel === "game";
  const isCelebration = panel === "celebration";
  const isGrand = panel === "reveal" && revealId === "grand";
  const reveal = REVEALS[revealId] || REVEALS.moon;
  const reward = GAME_REWARDS[celebrationId] || GAME_REWARDS.stars;
  const title = panel === "cabinet" ? "The secret arcade" : isCelebration ? reward.title : isGame
    ? ({ stars: "Seven-star catcher", memory: "Mimi's memory match", rhythm: "Mimi's pawprint rhythm", fireflies: "Firefly hunt", wishes: "The little wish jar" }[activeGame] || "A tiny secret")
    : reveal.title;

  return <>
    {toast && <div className="egg-toast" role="status"><span aria-hidden="true">✦</span><span>{toast}</span><button type="button" onClick={() => openArcade("firefly-trail")}>Open Secret Arcade</button><button className="egg-toast-dismiss" type="button" aria-label="Dismiss secret discovery" onClick={() => setToast("")}>×</button></div>}
    {panel && <div className={"egg-backdrop" + (isCelebration ? " is-celebration" : "") + (isGrand ? " is-grand-finale" : "")} onMouseDown={(event) => { if (event.target === event.currentTarget) (isGrand || isCelebration) ? returnToArcade() : closePanel(); }}>
      <section ref={dialogRef} className={"egg-dialog " + (isGrand ? "egg-grand-dialog" : isCelebration ? "egg-celebration-dialog" : (panel === "reveal" ? "is-reveal" : "is-" + panel))} role="dialog" aria-modal="true" aria-labelledby="egg-dialog-title">
        <button className="egg-close" type="button" aria-label={isCelebration || isGrand ? "Return to Secret Arcade" : "Close secret surprise"} onClick={isCelebration || isGrand ? returnToArcade : closePanel}>×</button>
        <div className="egg-dialog-stars" aria-hidden="true">✦ · ✧ · ♥ · ✧ · ✦</div>
        <p className="egg-kicker">a hidden corner of Malika's universe</p>
        {!isCelebration && !isGrand && <h2 id="egg-dialog-title">{title}</h2>}
        {isCelebration && <div className={"egg-celebration egg-celebration-theme-" + reward.theme}>
          <div className="egg-celebration-atmosphere" aria-hidden="true">
            <div className="egg-celebration-aurora" />
            <div className="egg-celebration-rings"><i /><i /><i /></div>
            <div className="egg-celebration-shockwaves"><i /><i /><i /></div>
            <div className="egg-celebration-heart-burst">
              {CELEBRATION_HEARTS.map((heart) => <i key={heart.id} style={heart.style}>{heart.glyph}</i>)}
            </div>
            <div className="egg-celebration-particles">
              {CELEBRATION_PARTICLES.map((particle) => <i className="egg-celebration-particle" key={particle.id} style={particle.style}>{particle.glyph}</i>)}
            </div>
          </div>
          <div className="egg-celebration-content">
            <div className="egg-reward-medallion" aria-hidden="true">
              <span className="egg-reward-medallion-orbit">✧　·　♡　·　✦</span>
              <span className="egg-reward-medallion-symbol">{reward.glyph}</span>
              <span className="egg-reward-medallion-caption">A LITTLE WIN FOR YOU</span>
            </div>
            <p className="egg-reward-kicker">{reward.eyebrow}</p>
            <p className="egg-reward-stamp"><span aria-hidden="true">✦</span> SIDE QUEST COMPLETE <span aria-hidden="true">✦</span></p>
            <h2 id="egg-dialog-title">{reward.title}</h2>
            <p className="egg-reward-copy">{reward.copy}</p>
            <p className="egg-reward-detail">{reward.detail}</p>
            <div className="egg-reward-score-card">
              <span className="egg-reward-score">{reward.score}</span>
              <div className="egg-reward-progress" role="progressbar" aria-label="Arcade games completed" aria-valuemin={0} aria-valuemax={ARCADE_GAMES.length} aria-valuenow={completedGames.length}>
                <span style={{ width: (completedGames.length / ARCADE_GAMES.length * 100) + "%" }} />
              </div>
              <span className="egg-reward-progress-label">ARCADE MASTERY · {completedGames.length} OF {ARCADE_GAMES.length}</span>
            </div>
            {completedGames.length === ARCADE_GAMES.length && <p className="egg-reward-grand-note">ALL FIVE QUESTS COMPLETE · THE GRAND SECRET IS UNSEALED ✧</p>}
            <div className="egg-celebration-actions">
              <button type="button" className="egg-action-button egg-celebration-primary" onClick={returnToArcade}>Back to Secret Arcade <span aria-hidden="true">↗</span></button>
              <button type="button" className="egg-celebration-secondary" onClick={() => startGame(celebrationId)}>Play this quest again <span aria-hidden="true">↻</span></button>
              {completedGames.length === ARCADE_GAMES.length && <button type="button" className="egg-celebration-grand-button" onClick={() => openReveal("grand")}>Unseal the grand secret <span aria-hidden="true">✦</span></button>}
            </div>
            <p className="egg-reward-footer">Made with love, and a wildly unreasonable amount of sparkle. ♡</p>
          </div>
        </div>}
        {panel === "reveal" && !isGrand && <div className="egg-reveal-content">
          <div className={"egg-reveal-glyph egg-reveal-" + revealId} aria-hidden="true">{reveal.glyph}</div>
          <p>{reveal.copy}</p>
          <div className="egg-burst" aria-hidden="true">{REVEAL_BURST.map((spark) => <i key={spark.id} style={spark.style}>{spark.glyph}</i>)}</div>
          <button type="button" className="egg-action-button" onClick={() => openArcade(revealId)}>Enter the Secret Arcade <span aria-hidden="true">↗</span></button>
        </div>}
        {isGrand && <div className="egg-grand-finale">
          <div className="grand-cosmos" aria-hidden="true">
            <div className="grand-nebula grand-nebula-one" />
            <div className="grand-nebula grand-nebula-two" />
            <div className="grand-cosmic-grid" />
            <div className="grand-orbit grand-orbit-one"><i /><i /><i /></div>
            <div className="grand-orbit grand-orbit-two"><i /><i /><i /></div>
            <div className="grand-supernova"><i /><i /><i /><span>✦</span></div>
            <div className="grand-flying-rewards">
              {GRAND_FLIGHT_OBJECTS.map((particle) => <i key={particle.id}
                className={"grand-flight-object " + particle.className} style={particle.style}>{particle.glyph}</i>)}
            </div>
            <div className="grand-comet-trails">
              {GRAND_COMETS.map((comet) => <i key={comet.id} style={comet.style} />)}
            </div>
          </div>
          <div className="grand-finale-content">
            <p className="grand-finale-prelude">YOU FOUND EVERY LITTLE WONDER</p>
            <div className="grand-heart-stage" aria-hidden="true">
              <div className="grand-heart-halo grand-heart-halo-one" />
              <div className="grand-heart-halo grand-heart-halo-two" />
              <div className="grand-heart-3d">
                {GRAND_HEART_DEPTHS.map((layer) => <span className="grand-heart-depth" key={layer.id} style={layer.style}>♥</span>)}
                <span className="grand-heart-face">♥</span>
                <span className="grand-heart-star grand-heart-star-one">✦</span>
                <span className="grand-heart-star grand-heart-star-two">✧</span>
              </div>
              <div className="grand-heart-nameplate">MALIKA</div>
            </div>
            <div className="grand-finale-label"><span>✦</span> THE GRAND SECRET <span>✦</span></div>
            <h2 id="egg-dialog-title" className="grand-finale-title">Keeper of Little Wonders</h2>
            <p className="grand-finale-copy">{reveal.copy}</p>
            <p className="grand-finale-signature">A whole little universe, made by Zack, just for you. <span>♡</span></p>
            <div className="grand-finale-treasures" aria-label="All five secret arcade quests completed">
              {GRAND_TREASURES.map((treasure) => <span className={"grand-treasure grand-treasure-" + treasure.index} key={treasure.symbol} style={treasure.style}>{treasure.symbol}</span>)}
            </div>
            <p className="grand-finale-achievement">FIVE LITTLE QUESTS · EVERY LAST SECRET FOUND</p>
            <div className="grand-finale-actions">
              <button type="button" className="grand-finale-primary" onClick={returnToArcade}>Return to your Secret Arcade <span>↗</span></button>
              <button type="button" className="grand-finale-secondary" onClick={() => { setPanel(null); setActiveGame(null); }}>Keep this little wonder <span>♡</span></button>
            </div>
            <p className="grand-finale-footnote">For the wonder you bring into the world — and all the wonder still to come.</p>
          </div>
        </div>}
        {panel === "cabinet" && <div className="egg-cabinet-content">
          <p className="egg-subtitle">You found the door behind the stars. Choose a little side quest; none of these games has a timer.</p>
          <div className="egg-arcade-progress" aria-label={completedGames.length + " of 5 games completed"}>
            <div className="egg-arcade-progress-heading"><span>Arcade mastery</span><strong>{completedGames.length} / {ARCADE_GAMES.length}</strong></div>
            <div className="egg-arcade-progress-track" role="progressbar" aria-label="Arcade games completed" aria-valuemin={0} aria-valuemax={ARCADE_GAMES.length} aria-valuenow={completedGames.length}>
              <span style={{ width: (completedGames.length / ARCADE_GAMES.length * 100) + "%" }} />
            </div>
          </div>
          <div className="egg-game-list">
            <button type="button" className={completedGames.includes("stars") ? "egg-game-tile is-complete" : "egg-game-tile"} onClick={() => startGame("stars")}><span>✧</span><strong>Seven-star catcher</strong><small>{completedGames.includes("stars") ? "✓ Complete · play again" : "Catch 7 of 12 hidden stars"}</small></button>
            <button type="button" className={completedGames.includes("memory") ? "egg-game-tile is-complete" : "egg-game-tile"} onClick={() => startGame("memory")}><span>🌙</span><strong>Mimi's memory match</strong><small>{completedGames.includes("memory") ? "✓ Complete · play again" : "Find the moon, paw, and heart pairs"}</small></button>
            <button type="button" className={completedGames.includes("rhythm") ? "egg-game-tile is-complete" : "egg-game-tile"} onClick={() => startGame("rhythm")}><span>🐾</span><strong>Pawprint rhythm</strong><small>{completedGames.includes("rhythm") ? "✓ Complete · play again" : "Repeat Mimi's four-beat code"}</small></button>
            <button type="button" className={completedGames.includes("fireflies") ? "egg-game-tile is-complete" : "egg-game-tile"} onClick={() => startGame("fireflies")}><span>✦</span><strong>Firefly hunt</strong><small>{completedGames.includes("fireflies") ? "✓ Complete · play again" : "Catch 5 glowing fireflies"}</small></button>
            <button type="button" className={completedGames.includes("wishes") ? "egg-game-tile is-complete" : "egg-game-tile"} onClick={() => startGame("wishes")}><span>🫙</span><strong>The little wish jar</strong><small>{completedGames.includes("wishes") ? "✓ Complete · play again" : "Reveal all five future-facing wishes"}</small></button>
          </div>
          <div className="egg-unlock-counter"><span>Secrets uncovered</span><strong>{unlocked.length}</strong></div>
          {unlocked.length > 0 && <p className="egg-tiny-note">Your discoveries are kept for this visit only.</p>}
          {completedGames.length === ARCADE_GAMES.length && <div className="egg-master-reward">
            <div className="egg-master-crown" aria-hidden="true">✧　♥　✧</div>
            <p>You found every side quest. One final secret is waiting for you.</p>
            <button type="button" className="egg-action-button" onClick={() => openReveal("grand")}>Open the grand secret <span aria-hidden="true">✦</span></button>
          </div>}
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
