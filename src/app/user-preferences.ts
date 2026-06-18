import type { Unsubscriber } from "svelte/store";
import {
    DEFAULT_USER_PREFERENCES,
    userPreferences,
    type InputMode,
    type UserPreferences,
} from "./state";

const USER_PREFERENCES_STORAGE_KEY = "verovio-user-preferences";

function isInputMode(value: unknown): value is InputMode {
    return value === "pitchFirst" || value === "durationFirst";
}

export function loadUserPreferencesFromStorage(): UserPreferences {
    const raw = localStorage.getItem(USER_PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PREFERENCES;
    try {
        const parsed = JSON.parse(raw) as Partial<UserPreferences>;
        return {
            pianoKeyboardEnabled:
                typeof parsed.pianoKeyboardEnabled === "boolean"
                    ? parsed.pianoKeyboardEnabled
                    : DEFAULT_USER_PREFERENCES.pianoKeyboardEnabled,
            inputMode: isInputMode(parsed.inputMode)
                ? parsed.inputMode
                : DEFAULT_USER_PREFERENCES.inputMode,
        };
    } catch {
        return DEFAULT_USER_PREFERENCES;
    }
}

export function saveUserPreferencesToStorage(preferences: UserPreferences): void {
    localStorage.setItem(
        USER_PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences),
    );
}

export function initUserPreferencesPersistence(): Unsubscriber {
    userPreferences.set(loadUserPreferencesFromStorage());
    return userPreferences.subscribe(saveUserPreferencesToStorage);
}
