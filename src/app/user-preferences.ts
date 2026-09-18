import type { Unsubscriber } from "svelte/store";
import {
    DEFAULT_USER_PREFERENCES,
    userPreferences,
    verovioState,
    type InputMode,
    type UserPreferences,
    type ViewMode,
} from "./state";

const USER_PREFERENCES_STORAGE_KEY = "verovio-user-preferences";

function isInputMode(value: unknown): value is InputMode {
    return value === "pitchFirst" || value === "durationFirst";
}

function isViewMode(value: unknown): value is ViewMode {
    return value === "page" || value === "responsive";
}

function isZoom(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
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
            viewMode: isViewMode(parsed.viewMode)
                ? parsed.viewMode
                : DEFAULT_USER_PREFERENCES.viewMode,
            zoom: isZoom(parsed.zoom)
                ? parsed.zoom
                : DEFAULT_USER_PREFERENCES.zoom,
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
    const preferences = loadUserPreferencesFromStorage();
    userPreferences.set(preferences);
    verovioState.update((current) => ({
        ...current,
        zoom: preferences.zoom,
    }));
    return userPreferences.subscribe((currentPreferences) => {
        saveUserPreferencesToStorage(currentPreferences);
        verovioState.update((current) => ({
            ...current,
            zoom: currentPreferences.zoom,
        }));
    });
}
