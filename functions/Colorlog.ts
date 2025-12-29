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
export default function Coloredlog(message: string, color: string): void {
    // #region Color Validation Regexes
    /** Regex patterns to validate different color formats */
    const ColorRegex = {
        /** Hex colors: #RGB, #RGBA, #RRGGBB, #RRGGBBAA */
        hex: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
        /** RGB/RGBA colors: rgb(r, g, b) or rgba(r, g, b, a) */
        rgb: /^rgba?\(\s*(\d{1,3}%?)\s*[\s,]\s*(\d{1,3}%?)\s*[\s,]\s*(\d{1,3}%?)(?:\s*[\s,/]\s*((?:0|1|0?\.\d+)(?:%?)))?\s*\)$/,
        /** CSS named colors (e.g., 'red', 'blue', 'aliceblue') */
        named: /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|mineskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|palegoldenrod|palegreen|palevioletred)$/i,
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
        /** Use CSS styling for valid colors */
        console.log(`%c${message}`, `color: ${color}; font-weight: bold;`);
    } else {
        /** Fallback: plain console.log if color is invalid */
        console.log(message);
    }
    // #endregion
}
