import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { STORAGE_KEYS } from "~/config";

export type LearningSettings = {
  shuffle: boolean;
  thoroughLearning: boolean;
};

const defaultLearningSettings: LearningSettings = {
  shuffle: false,
  thoroughLearning: false,
};

// Persistent atom that saves to localStorage
export const learningSettingsAtom = atomWithStorage<LearningSettings>(
  STORAGE_KEYS.LEARNING_SETTINGS,
  defaultLearningSettings
);

// Derived atoms for individual settings
export const shuffleAtom = atom(
  (get) => get(learningSettingsAtom).shuffle,
  (get, set, value: boolean) => {
    const current = get(learningSettingsAtom);
    set(learningSettingsAtom, { ...current, shuffle: value });
  }
);

export const thoroughLearningAtom = atom(
  (get) => get(learningSettingsAtom).thoroughLearning,
  (get, set, value: boolean) => {
    const current = get(learningSettingsAtom);
    set(learningSettingsAtom, { ...current, thoroughLearning: value });
  }
);