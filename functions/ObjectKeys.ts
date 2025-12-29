/**
 * Object utilities for key validation and inspection.
 * Provides functions to count, range-check, and validate object keys.
 */

// #region Keysamount
/**
 * Count the number of keys in an object.
 * @param obj - The object to inspect
 * @returns The number of keys (properties) in the object
 */
export function Keysamount(obj: Record<string, any>): number {
    return Object.keys(obj).length;
}
// #endregion

// #region KeysInRange
/**
 * Check if an object's key count is within a specified range.
 * If only min is provided, checks for exact match.
 * @param obj - The object to inspect
 * @param min - Minimum key count (or exact count if max is undefined)
 * @param max - Maximum key count (optional)
 * @returns true if key count is within range, false otherwise
 */
export function KeysInRange(obj: Record<string, any>, min: number, max: number): boolean {
    const keyCount = Keysamount(obj);
    // If max not provided, treat min as exact count
    if (max === undefined) {
        max = min;
    }
    return keyCount >= min && keyCount <= max;
}
// #endregion

// #region KeysInRangeDetailed
/**
 * Check if an object's key count is within range and return detailed status.
 * @param obj - The object to inspect
 * @param min - Minimum key count
 * @param max - Maximum key count
 * @returns -1 if below minimum, 1 if above maximum, 0 if within range
 */
export function KeysInRangeDetailed(obj: Record<string, any>, min: number, max: number): number {
    const keyCount = Keysamount(obj);
    // If max not provided, treat min as exact count
    if (max === undefined) {
        max = min;
    }
    if (keyCount < min) {
        return -1;
    } else if (keyCount > max) {
        return 1;
    } else {
        return 0;
    }
}
// #endregion

// #region AllowedKeys
/**
 * Validate that an object contains only allowed keys.
 * All required keys must be present; object can only contain required + optional keys.
 * @param obj - The object to validate
 * @param keys - Required keys that must be present
 * @param optionalKeys - Optional keys that may be present (default: [])
 * @returns true if validation passes, false if any rule violated
 */
export function AllowedKeys(obj: Record<string, any>, keys: string[], optionalKeys: string[] = []): boolean {
    const objKeys = Object.keys(obj);
    const allowedSet = new Set([...keys, ...optionalKeys]);

    // Check: object doesn't have extra keys
    if (objKeys.length > allowedSet.size) {
        return false;
    }

    // Check: all required keys are present
    for (const key of keys) {
        if (!(key in obj)) {
            return false;
        }
    }

    // Check: all keys in object are allowed
    for (const key of objKeys) {
        if (!allowedSet.has(key)) {
            return false;
        }
    }

    return true;
}
// #endregion

// #region Exports
export default {
    Keysamount,
    KeysInRange,
    KeysInRangeDetailed,
    AllowedKeys
};
// #endregion
