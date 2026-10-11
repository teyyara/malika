import { createInitialGameState, gameReducer } from "../game/gameLogic.js";

export function createInitialExperienceState(requiredHearts = 7) {
  return { scene: "welcome", activeMessageId: null, discoveredMessageIds: [], game: createInitialGameState(requiredHearts) };
}

export function experienceReducer(state, action) {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, scene: action.scene, activeMessageId: null };
    case "OPEN_NOTE":
      return {
        ...state,
        activeMessageId: action.id,
        discoveredMessageIds: state.discoveredMessageIds.includes(action.id)
          ? state.discoveredMessageIds
          : [...state.discoveredMessageIds, action.id]
      };
    case "CLOSE_NOTE":
      return { ...state, activeMessageId: null };
    case "GAME_ACTION":
      return { ...state, game: gameReducer(state.game, action.action) };
    default:
      return state;
  }
}
