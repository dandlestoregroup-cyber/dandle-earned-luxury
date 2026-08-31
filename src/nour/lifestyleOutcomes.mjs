export const DANDLE_LIFESTYLE_OUTCOMES = Object.freeze({
  RelaxMax: "Deep TV and near-flat relaxation",
  ComfortPlus: "Long-sit comfort with massage support",
  "EasyUp Standard": "Easier sitting down and standing up",
  "EasyUp Compact": "Lift assistance for smaller rooms",
  SpaceSaver: "Full recline comfort with less room pressure",
  WorkNest: "Work-from-home comfort without leaving the chair",
  Diva: "A statement chair that anchors the room",
  CozyCompanion: "Shared couple comfort with a dedicated console",
  "Dandle Complete Set": "A coordinated comfort-first living room",
});

export function getLifestyleOutcome(model) {
  return DANDLE_LIFESTYLE_OUTCOMES[model] || null;
}
