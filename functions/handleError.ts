import Configs from './Config';
import Coloredlog from './Colorlog';

/**
 * Express error handler middleware for centralized error handling
 * with multi-language support, smart logging, and user-friendly messages.
 *
 * Usage: app.use(errorHandler) at the end of middleware chain
 */
export default function errorHandler(err: any, req: any, res: any, next: any): void {
    // #region Initialize Configuration
    const responses = Configs.getResponses();
    const prefs = Configs.getPrefs();
    // #endregion

    // #region Extract Request Context
    /** Detect user language from request or Accept-Language header */
    const lang = (req.lang || req.language || (req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en'));

    /** Extract error details from error object */
    const statusCode: number = err.status || 500;
    const code: string = err.code || 'INTERNAL_SERVER_ERROR';
    const rawErrorMessage: string = err.message || '';
    // #endregion

    // #region Server Default Messages
    /** Fallback messages for server-side (5xx) errors when localized responses unavailable */
    const serverDefaultMessages: Record<string, string> = {
        INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
        DATABASE_ERROR: 'A database error occurred.',
        SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',
        BAD_GATEWAY: 'Bad gateway.',
        GATEWAY_TIMEOUT: 'Gateway timed out.',
        NOT_IMPLEMENTED: 'This feature is not implemented.',
        NETWORK_ERROR: 'A network error occurred.',
        TIMEOUT: 'The operation timed out.'
    };
    // #endregion

    // #region Build User-Facing Response Message
    /** Get localized responses for detected language, fallback to English */
    const possibleResponses = responses[lang] || responses['en'] || {};
    let responseMessage: string = '';

    /** Handle duplicate entry errors (e.g., unique constraint violations) */
    if (code === 'ER_DUP_ENTRY' || rawErrorMessage.includes('ER_DUP_ENTRY')) {
        const noDupesof = prefs.noDupesAllowedof || [];

        for (const field of noDupesof) {
            if (rawErrorMessage.includes(field)) {
                responseMessage = possibleResponses.dupes?.[field];
                break;
            }
        }
    }
    /** Handle validation errors with per-field messages */
    else if (code === 'VALIDATION_ERROR' && err.errors) {
        for (const fieldError of err.errors) {
            const fieldName = fieldError.param || fieldError.path;
            if (possibleResponses.validation?.[fieldName]) {
                responseMessage = possibleResponses.validation[fieldName];
                break;
            }
        }
    }
    /** Fallback: use raw error message if no specific handler matched */
    else {
        responseMessage = rawErrorMessage;
    }

    /** Apply fallback logic for message resolution */
    if (!responseMessage) {
        // Try localized message by error code
        if (possibleResponses[code]) {
            responseMessage = possibleResponses[code];
        }
        // Try server default for 5xx errors
        else if (statusCode >= 500 && serverDefaultMessages[code]) {
            responseMessage = serverDefaultMessages[code];
        }
        // Final fallback: generic error message
        else {
            responseMessage = possibleResponses.general?.error || serverDefaultMessages['INTERNAL_SERVER_ERROR'];
        }
    }
    // #endregion

    // #region Error Classification (User vs Server)
    /**
     * Classify errors to determine whether to log details for maintainers.
     * User-caused errors (4xx) are silenced; server errors (5xx) are logged.
     */
    const userCausedCodes = new Set([
        'VALIDATION_ERROR',
        'ER_DUP_ENTRY',
        'BAD_REQUEST',
        'UNAUTHORIZED',
        'FORBIDDEN',
        'NOT_FOUND',
        'CONFLICT',
        'METHOD_NOT_ALLOWED',
        'NOT_ACCEPTABLE',
        'UNSUPPORTED_MEDIA_TYPE',
        'PAYLOAD_TOO_LARGE',
        'UNPROCESSABLE_ENTITY',
        'TOO_MANY_REQUESTS'
    ]);
    const isUserError = (statusCode >= 400 && statusCode < 500) || userCausedCodes.has(code);
    // #endregion

    // #region Maintainer Logging (Server Errors Only)
    /** Extract route information for logging */
    const routeInfo = `${req.method || ''} ${req.originalUrl || req.url || ''}`.trim();
    const requestId = (req.id || req.requestId || '');

    /** Log detailed, color-coded error report for maintainers (skip for user-caused errors) */
    if (!isUserError) {
        Coloredlog('===================== ERROR REPORT =====================', 'red');

        // Timestamp
        let exactTime = new Date().toISOString();
        exactTime = exactTime.replace('T', ' ').replace('Z', '');
        Coloredlog(`Time: ${exactTime}`, 'yellow');

        // Request context
        if (routeInfo) Coloredlog(`Route: ${routeInfo}`, 'yellow');
        if (requestId) Coloredlog(`RequestId: ${requestId}`, 'yellow');

        // Error details
        Coloredlog(`Status: ${statusCode}`, 'magenta');
        Coloredlog(`Code: ${code}`, 'magenta');

        // Messages for comparison
        Coloredlog(`UserMessage: ${responseMessage}`, 'cyan');
        Coloredlog(`RawMessage: ${rawErrorMessage}`, 'white');

        // Stack trace for debugging
        Coloredlog('Stack:', 'gray');
        Coloredlog(err && err.stack ? String(err.stack) : 'N/A', 'gray');

        Coloredlog('========================================================', 'red');
    }
    // #endregion

    // #region Send Response to Client
    /** Return JSON response with error details (safe for client) */
    res.status(statusCode).json({
        status: 'error',
        code: code,
        message: responseMessage
    });
    // #endregion
}