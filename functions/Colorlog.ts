/**
 * Log a message to console with color support.
 * Accepts hex, RGB, RGBA, and CSS named colors.
 * Falls back to unstyled console.log if color is invalid.
 *
 * @param message - Text to log
 * @param color - Valid hex (#XXX, #XXXX, #XXXXXX, #XXXXXXXX),
 *                RGB (rgb(r, g, b)), RGBA (rgba(r, g, b, a)),
 *                or CSS named color
 *
 * @example
 * coloredlog('Error!', 'red');
 * coloredlog('Success', '#00FF00');
 * coloredlog('Info', 'rgb(0, 0, 255)');
 */
export default function Coloredlog(message: string, color: string, bolded: boolean = false): void {
    // #region Color Validation Regexes
    /** Regex patterns to validate different color formats */
    const ColorRegex = {
        /** Hex colors: #RGB, #RGBA, #RRGGBB, #RRGGBBAA */
        hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        /** RGB/RGBA colors: rgb(r, g, b) or rgba(r, g, b, a) */
        rgb: /^rgba?\(\s*(\d{1,3}%?)\s*[\s,]\s*(\d{1,3}%?)\s*[\s,]\s*(\d{1,3}%?)(?:\s*[\s,/]\s*((?:0|1|0?\.\d+)(?:%?)))?\s*\)$/,
        /** CSS named colors (e.g., 'red', 'blue', 'aliceblue') */
        named: /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|mineskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mincream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|palegoldenrod|palegreen|palevioletred)$/i,
    };
    // #endregion

    // #region Helpers for Node console coloring
    const isBrowser = typeof globalThis !== 'undefined' && typeof (globalThis as any).document !== 'undefined';

    const namedAnsi: Record<string, string> = {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
        grey: '\x1b[90m'
    };

    const hexToRgb = (value: string): { r: number; g: number; b: number } | null => {
        const clean = value.replace('#', '');
        if (clean.length === 3 || clean.length === 4) {
            const r = parseInt(clean[0] + clean[0], 16);
            const g = parseInt(clean[1] + clean[1], 16);
            const b = parseInt(clean[2] + clean[2], 16);
            return { r, g, b };
        }
        if (clean.length === 6 || clean.length === 8) {
            const r = parseInt(clean.slice(0, 2), 16);
            const g = parseInt(clean.slice(2, 4), 16);
            const b = parseInt(clean.slice(4, 6), 16);
            return { r, g, b };
        }
        return null;
    };

    const rgbStringToRgb = (value: string): { r: number; g: number; b: number } | null => {
        const match = ColorRegex.rgb.exec(value);
        if (!match) return null;
        const toNum = (input: string): number => {
            if (input.endsWith('%')) {
                const pct = parseFloat(input.replace('%', ''));
                return Math.max(0, Math.min(255, Math.round((pct / 100) * 255)));
            }
            return Math.max(0, Math.min(255, parseInt(input, 10)));
        };
        return { r: toNum(match[1]), g: toNum(match[2]), b: toNum(match[3]) };
    };

    const colorToAnsi = (value: string): string | null => {
        const lower = value.toLowerCase();
        if (namedAnsi[lower]) return namedAnsi[lower];

        if (ColorRegex.hex.test(value)) {
            const rgb = hexToRgb(value);
            if (rgb) return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
        }

        if (ColorRegex.rgb.test(value)) {
            const rgb = rgbStringToRgb(value);
            if (rgb) return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
        }

        return null;
    };
    // #endregion

    // #region Validate Color Format
    /** Test if color matches any valid format */
    const isValid = 
        ColorRegex.hex.test(color) || 
        ColorRegex.rgb.test(color) || 
        ColorRegex.named.test(color);
    // #endregion

    // #region Output
    if (isValid) {
        if (isBrowser) {
            const weight = bolded ? 'bold' : 'normal';
            console.log(`%c${message}`, `color: ${color}; font-weight: ${weight};`);
        } else {
            const ansi = colorToAnsi(color);
            const boldAnsi = bolded ? '\x1b[1m' : '';
            if (ansi) {
                console.log(`${ansi}${boldAnsi}${message}\x1b[0m`);
            } else if (bolded) {
                console.log(`\x1b[1m${message}\x1b[0m`);
            } else {
                console.log(message);
            }
        }
    } else {
        if (bolded) {
            console.log(`\x1b[1m${message}\x1b[0m`);
        } else {
            console.log(message);
        }
    }
    // #endregion
}
