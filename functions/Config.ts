/**
 * Runtime configuration manager for preferences and localized response messages.
 * Stores global state for error messages, language preferences, and custom messages.
 */

// #region Runtime State
/** Cached localized response messages for all languages */
let runtimeResponses: any = {};

/** Cached preferences (languages, duplicate field names, etc.) */
let runtimePrefs: any = {
    noDupesAllowedof: [],
    acceptedLanguages: ['en']
};
// #endregion

const Configs = {
    // #region Configure
    /**
     * Initialize configuration with custom responses and preferences.
     * Merges or replaces the runtime state.
     * @param options.responses - Localized message objects by language
     * @param options.prefs - Preferences including acceptedLanguages and noDupesAllowedof
     */
    configure(options: { responses: any; prefs: any }) {
        runtimeResponses = options.responses;
        runtimePrefs = options.prefs;
    },
    // #endregion

    // #region Get Responses
    /**
     * Retrieve all configured localized response messages.
     * @returns The current responses object (by language and code)
     */
    getResponses() {
        return runtimeResponses;
    },
    // #endregion

    // #region Get Preferences
    /**
     * Retrieve current preferences.
     * @returns The current preferences object
     */
    getPrefs() {
        return runtimePrefs;
    },
    // #endregion

    // #region Set Message
    /**
     * Set or update a single message for a language and error code.
     * Useful for dynamically adding custom messages at runtime.
     * @param lang - Language code (e.g., 'en', 'es', 'fr')
     * @param code - Error or message code (e.g., 'CUSTOM_ERROR', 'ObjectTooLong')
     * @param message - The message text
     */
    setMessage(lang: string, code: string, message: string) {
        // Initialize responses if not yet configured
        if (!runtimeResponses || typeof runtimeResponses !== 'object') {
            runtimeResponses = {};
        }
        // Initialize language pack if not exists
        if (!runtimeResponses[lang] || typeof runtimeResponses[lang] !== 'object') {
            runtimeResponses[lang] = {};
        }
        // Set the message
        runtimeResponses[lang][code] = message;
    },
    // #endregion

    // #region Get Message
    /**
     * Retrieve a message by language and code with graceful fallbacks.
     * Fallback chain: requested language → English → provided fallback → undefined
     * @param lang - Language code to look up
     * @param code - Message code to retrieve
     * @param fallback - Optional fallback message if not found
     * @returns The message, fallback, or undefined
     */
    getMessage(lang: string, code: string, fallback?: string): string | undefined {
        // Try requested language first
        const langPack = runtimeResponses?.[lang];
        if (langPack && typeof langPack[code] === 'string') {
            return langPack[code];
        }
        // Fall back to English
        const englishPack = runtimeResponses?.['en'];
        if (englishPack && typeof englishPack[code] === 'string') {
            return englishPack[code];
        }
        // Return provided fallback or undefined
        return fallback;
    }
    // #endregion
};

export default Configs;