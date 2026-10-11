export const DEFAULT_REQUIRED_HEARTS = 7;

const SPAWN_POINTS = [
  { x: 15, y: 24 }, { x: 43, y: 19 }, { x: 73, y: 33 }, { x: 31, y: 57 },
  { x: 62, y: 66 }, { x: 82, y: 54 }, { x: 17, y: 76 }, { x: 48, y: 42 },
  { x: 76, y: 17 }, { x: 38, y: 34 }, { x: 57, y: 25 }, { x: 24, y: 44 }
];

export function createInitialGameState(requiredHearts = DEFAULT_REQUIRED_HEARTS) {
  const target = Number.isInteger(requiredHearts) && requiredHearts > 0 ? requiredHearts : DEFAULT_REQUIRED_HEARTS;
  return { status: "ready", count: 0, requiredHearts: target, collectibles: [], nextId: 5, bonusCount: 0 };
}

function createStartingCollectibles() {
  return [
    { id: "heart-1", type: "heart", x: 15, y: 24 },
    { id: "heart-2", type: "heart", x: 43, y: 19 },
    { id: "heart-3", type: "heart", x: 73, y: 33 },
    { id: "heart-4", type: "heart", x: 31, y: 57 },
    { id: "ladybug-1", type: "ladybug", x: 81, y: 29, messageId: "wish-02" }
  ];
}

function startGame(requiredHearts) {
  return { ...createInitialGameState(requiredHearts), status: "playing", collectibles: createStartingCollectibles(), nextId: 5 };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "START":
      return state.status === "ready" ? startGame(state.requiredHearts) : state;
    case "COLLECT": {
      if (state.status !== "playing") return state;
      const item = state.collectibles.find((candidate) => candidate.id === action.id);
      if (!item) return state;
      const remaining = state.collectibles.filter((candidate) => candidate.id !== item.id);
      if (item.type === "ladybug") return { ...state, collectibles: remaining, bonusCount: state.bonusCount + 1 };
      const count = state.count + 1;
      if (count >= state.requiredHearts) return { ...state, status: "won", count: state.requiredHearts, collectibles: remaining };
      const point = SPAWN_POINTS[(state.nextId - 1) % SPAWN_POINTS.length];
      const replacement = { id: "heart-" + state.nextId, type: "heart", x: point.x, y: point.y };
      return { ...state, count, collectibles: [...remaining, replacement], nextId: state.nextId + 1 };
    }
    case "RESTART":
      return createInitialGameState(state.requiredHearts);
    default:
      return state;
  }
}
